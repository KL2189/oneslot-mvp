# Google Calendar Integration

This document describes the Google Calendar integration for the OneSlot MVP.

## Overview

The Google Calendar integration allows users to:
- Connect their Google Calendar account via OAuth
- View all their calendars
- Check availability across calendars
- Create calendar events
- List events from specific calendars

## Architecture

### Backend (Supabase Edge Functions)

#### 1. OAuth Flow Functions

**oauth-google-start** (`/supabase/functions/oauth-google-start/index.ts`)
- Initiates the OAuth flow
- Generates authorization URL with required scopes
- Scopes: `calendar.readonly`, `email`, `profile`
- Returns authorization URL to redirect user

**oauth-google-callback** (`/supabase/functions/oauth-google-callback/index.ts`)
- Handles OAuth callback from Google
- Exchanges authorization code for access and refresh tokens
- Stores tokens in `calendar_accounts` table
- Fetches and stores user's Google email

#### 2. Calendar API Function

**google-calendar** (`/supabase/functions/google-calendar/index.ts`)
- Main service for interacting with Google Calendar API
- Handles token refresh automatically
- Supports multiple actions:
  - `list_calendars`: Get user's calendar list
  - `list_events`: Fetch events from a specific calendar
  - `check_availability`: Use freebusy API to check availability
  - `create_event`: Create a new calendar event

### Frontend

#### Hooks

**useGoogleCalendar** (`/src/hooks/useGoogleCalendar.tsx`)
- React hook for calendar operations
- Functions:
  - `listCalendars()`: Get all user calendars
  - `listEvents(calendarId, timeMin, timeMax)`: Get events
  - `checkAvailability(calendarId, timeMin, timeMax)`: Check busy times
  - `createEvent(calendarId, event)`: Create new event
  - `initiateGoogleCalendarOAuth()`: Start OAuth flow
  - `getConnectedAccount()`: Get connected calendar account
  - `disconnectCalendar()`: Remove calendar connection

#### Pages

**CalendarConnections** (`/src/pages/CalendarConnections.tsx`)
- UI for managing calendar connections
- Shows connection status
- Displays list of user's calendars
- Allows connecting/disconnecting Google Calendar

## Database Schema

### calendar_accounts Table

```sql
{
  id: UUID (primary key)
  user_id: UUID (foreign key to profiles)
  provider: string ('google')
  email: string
  access_token: string
  refresh_token: string
  created_at: timestamp
  updated_at: timestamp
}
```

## Environment Variables

Required Supabase Edge Function secrets:

```
GOOGLE_CLIENT_ID         # Google OAuth Client ID
GOOGLE_CLIENT_SECRET     # Google OAuth Client Secret
SUPABASE_URL            # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY  # Service role key for DB access
```

Set these using:
```bash
supabase secrets set GOOGLE_CLIENT_ID=your_client_id
supabase secrets set GOOGLE_CLIENT_SECRET=your_client_secret
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   ```
   https://your-project.supabase.co/functions/v1/oauth-google-callback
   ```
6. Set scopes:
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`

## Usage Examples

### Connecting Google Calendar

```typescript
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

function MyComponent() {
  const { initiateGoogleCalendarOAuth } = useGoogleCalendar();

  return (
    <button onClick={initiateGoogleCalendarOAuth}>
      Connect Google Calendar
    </button>
  );
}
```

### Listing Calendars

```typescript
const { listCalendars } = useGoogleCalendar();

const calendars = await listCalendars();
// Returns: Array<{ id, summary, description, primary, backgroundColor, ... }>
```

### Checking Availability

```typescript
const { checkAvailability } = useGoogleCalendar();

const busyTimes = await checkAvailability(
  'primary',
  '2025-01-01T00:00:00Z',
  '2025-01-02T00:00:00Z'
);
// Returns: { calendars: { [calendarId]: { busy: [{ start, end }] } } }
```

### Creating an Event

```typescript
const { createEvent } = useGoogleCalendar();

const event = await createEvent('primary', {
  summary: 'Meeting with John',
  description: 'Discuss project timeline',
  start: {
    dateTime: '2025-01-15T10:00:00-05:00',
    timeZone: 'America/New_York'
  },
  end: {
    dateTime: '2025-01-15T11:00:00-05:00',
    timeZone: 'America/New_York'
  },
  attendees: [
    { email: 'john@example.com' }
  ]
});
```

### Listing Events

```typescript
const { listEvents } = useGoogleCalendar();

const events = await listEvents(
  'primary',
  '2025-01-01T00:00:00Z',
  '2025-01-31T23:59:59Z'
);
// Returns: Array<{ id, summary, start, end, attendees, ... }>
```

## Security Considerations

1. **Token Storage**: Access and refresh tokens are stored encrypted in Supabase
2. **Token Refresh**: Access tokens are automatically refreshed when expired
3. **User Authorization**: All API calls require valid Supabase session
4. **CORS**: Properly configured for frontend access
5. **Scopes**: Minimal required scopes are requested

## Testing

To test the integration:

1. Deploy the edge functions:
   ```bash
   supabase functions deploy oauth-google-start
   supabase functions deploy oauth-google-callback
   supabase functions deploy google-calendar
   ```

2. Set environment variables in Supabase dashboard

3. Navigate to `/calendar-connections` in the app

4. Click "Connect Google Calendar"

5. Authorize the app in Google

6. View your connected calendars

## Future Enhancements

- [ ] Support for multiple calendar providers (Outlook, iCloud)
- [ ] Calendar sync to local database
- [ ] Webhook support for real-time updates
- [ ] Event conflict detection
- [ ] Calendar selection for availability checking
- [ ] Two-way sync for events created in OneSlot
