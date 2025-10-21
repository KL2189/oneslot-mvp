import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CalendarRequest {
  action: 'list_calendars' | 'list_events' | 'check_availability' | 'create_event';
  calendarId?: string;
  timeMin?: string;
  timeMax?: string;
  event?: {
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
    attendees?: Array<{ email: string }>;
  };
}

async function refreshAccessToken(
  refreshToken: string,
  clientId: string,
  clientSecret: string
): Promise<string> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${await response.text()}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function makeGoogleCalendarRequest(
  accessToken: string,
  endpoint: string,
  method: string = "GET",
  body?: any
) {
  const url = `https://www.googleapis.com/calendar/v3/${endpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Calendar API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const googleClientId = Deno.env.get("GOOGLE_CLIENT_ID")!;
    const googleClientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET")!;

    // Get the user's JWT token from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create Supabase client with user's JWT
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated");
    }

    // Get user's calendar account from database
    const { data: calendarAccount, error: accountError } = await supabaseClient
      .from("calendar_accounts")
      .select("*")
      .eq("user_id", user.id)
      .eq("provider", "google")
      .single();

    if (accountError || !calendarAccount) {
      throw new Error("No Google calendar account connected");
    }

    // Parse request body
    const requestData: CalendarRequest = await req.json();

    let accessToken = calendarAccount.access_token;

    // Try to refresh the token if we have a refresh token
    if (calendarAccount.refresh_token) {
      try {
        accessToken = await refreshAccessToken(
          calendarAccount.refresh_token,
          googleClientId,
          googleClientSecret
        );

        // Update the access token in the database
        await supabaseClient
          .from("calendar_accounts")
          .update({ access_token: accessToken })
          .eq("id", calendarAccount.id);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Continue with existing token, it might still work
      }
    }

    // Handle different calendar actions
    let result;

    switch (requestData.action) {
      case "list_calendars": {
        result = await makeGoogleCalendarRequest(
          accessToken,
          "users/me/calendarList"
        );
        break;
      }

      case "list_events": {
        if (!requestData.calendarId) {
          throw new Error("calendarId is required for list_events");
        }

        const params = new URLSearchParams();
        if (requestData.timeMin) params.append("timeMin", requestData.timeMin);
        if (requestData.timeMax) params.append("timeMax", requestData.timeMax);
        params.append("singleEvents", "true");
        params.append("orderBy", "startTime");

        result = await makeGoogleCalendarRequest(
          accessToken,
          `calendars/${encodeURIComponent(requestData.calendarId)}/events?${params}`
        );
        break;
      }

      case "check_availability": {
        if (!requestData.calendarId || !requestData.timeMin || !requestData.timeMax) {
          throw new Error("calendarId, timeMin, and timeMax are required for check_availability");
        }

        // Use freebusy API to check availability
        result = await makeGoogleCalendarRequest(
          accessToken,
          "freeBusy",
          "POST",
          {
            timeMin: requestData.timeMin,
            timeMax: requestData.timeMax,
            items: [{ id: requestData.calendarId }],
          }
        );
        break;
      }

      case "create_event": {
        if (!requestData.calendarId || !requestData.event) {
          throw new Error("calendarId and event are required for create_event");
        }

        result = await makeGoogleCalendarRequest(
          accessToken,
          `calendars/${encodeURIComponent(requestData.calendarId)}/events`,
          "POST",
          requestData.event
        );
        break;
      }

      default:
        throw new Error(`Unknown action: ${requestData.action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
