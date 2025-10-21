import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GoogleCalendar {
  id: string;
  summary: string;
  description?: string;
  primary?: boolean;
  backgroundColor?: string;
  foregroundColor?: string;
  accessRole?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{ email: string; responseStatus?: string }>;
  htmlLink?: string;
}

export interface FreeBusyResponse {
  calendars: {
    [calendarId: string]: {
      busy: Array<{
        start: string;
        end: string;
      }>;
    };
  };
}

export const useGoogleCalendar = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const callCalendarFunction = async (action: string, params?: any) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/google-calendar`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action, ...params }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Calendar operation failed');
      }

      return result.data;
    } catch (error: any) {
      console.error('Calendar function error:', error);
      toast({
        title: 'Calendar Error',
        description: error.message || 'Failed to perform calendar operation',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const listCalendars = async (): Promise<GoogleCalendar[]> => {
    const data = await callCalendarFunction('list_calendars');
    return data.items || [];
  };

  const listEvents = async (
    calendarId: string,
    timeMin?: string,
    timeMax?: string
  ): Promise<CalendarEvent[]> => {
    const data = await callCalendarFunction('list_events', {
      calendarId,
      timeMin,
      timeMax,
    });
    return data.items || [];
  };

  const checkAvailability = async (
    calendarId: string,
    timeMin: string,
    timeMax: string
  ): Promise<FreeBusyResponse> => {
    return await callCalendarFunction('check_availability', {
      calendarId,
      timeMin,
      timeMax,
    });
  };

  const createEvent = async (
    calendarId: string,
    event: {
      summary: string;
      description?: string;
      start: { dateTime: string; timeZone: string };
      end: { dateTime: string; timeZone: string };
      attendees?: Array<{ email: string }>;
    }
  ): Promise<CalendarEvent> => {
    return await callCalendarFunction('create_event', {
      calendarId,
      event,
    });
  };

  const initiateGoogleCalendarOAuth = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/oauth-google-start`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (result.authUrl) {
        window.location.href = result.authUrl;
      } else {
        throw new Error('Failed to get authorization URL');
      }
    } catch (error: any) {
      console.error('OAuth initiation error:', error);
      toast({
        title: 'Connection Error',
        description: error.message || 'Failed to initiate Google Calendar connection',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getConnectedAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('calendar_accounts')
        .select('*')
        .eq('user_id', user.id)
        .eq('provider', 'google')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching connected account:', error);
      return null;
    }
  };

  const disconnectCalendar = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('calendar_accounts')
        .delete()
        .eq('user_id', user.id)
        .eq('provider', 'google');

      if (error) {
        throw error;
      }

      toast({
        title: 'Calendar Disconnected',
        description: 'Your Google Calendar has been disconnected successfully',
      });

      return true;
    } catch (error: any) {
      console.error('Error disconnecting calendar:', error);
      toast({
        title: 'Disconnection Error',
        description: error.message || 'Failed to disconnect calendar',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    loading,
    listCalendars,
    listEvents,
    checkAvailability,
    createEvent,
    initiateGoogleCalendarOAuth,
    getConnectedAccount,
    disconnectCalendar,
  };
};
