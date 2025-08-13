
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return new Response(
        `<html><body><script>window.close();</script><p>Authorization cancelled</p></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (!code || !state) {
      return new Response(
        `<html><body><script>window.close();</script><p>Missing authorization code</p></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Decode state to get user ID
    const { userId } = JSON.parse(atob(state));

    // Exchange code for tokens
    const clientId = Deno.env.get('GOOGLE_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');
    const redirectUri = 'https://buteohtchnbywfkjwjhf.supabase.co/functions/v1/oauth-google-callback';

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return new Response(
        `<html><body><script>window.close();</script><p>Token exchange failed</p></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store tokens and user info in calendar_accounts table
    const { error: dbError } = await supabase
      .from('calendar_accounts')
      .upsert({
        user_id: userId,
        provider: 'google',
        email: userInfo.email,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
      }, {
        onConflict: 'user_id,provider,email'
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        `<html><body><script>window.close();</script><p>Failed to save account</p></body></html>`,
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Success - close the popup and redirect parent
    return new Response(
      `<html><body><script>
        window.opener?.postMessage({ type: 'OAUTH_SUCCESS', provider: 'google' }, '*');
        window.close();
      </script><p>Google Calendar connected successfully! You can close this window.</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } catch (error) {
    console.error('Error in oauth-google-callback:', error);
    return new Response(
      `<html><body><script>window.close();</script><p>An error occurred</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
})
