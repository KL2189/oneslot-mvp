
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, Plus, Settings, AlertCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useGoogleCalendar, GoogleCalendar } from "@/hooks/useGoogleCalendar";

interface ConnectedAccount {
  id: string;
  provider: string;
  email: string;
}

export default function CalendarConnections() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    loading: calendarLoading,
    initiateGoogleCalendarOAuth,
    getConnectedAccount,
    listCalendars,
    disconnectCalendar,
  } = useGoogleCalendar();

  const [connectedAccount, setConnectedAccount] = useState<ConnectedAccount | null>(null);
  const [calendars, setCalendars] = useState<GoogleCalendar[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCalendars, setLoadingCalendars] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConnectedAccount();
    }
  }, [user]);

  useEffect(() => {
    if (connectedAccount) {
      fetchCalendars();
    }
  }, [connectedAccount]);

  const fetchConnectedAccount = async () => {
    if (!user) return;

    try {
      const account = await getConnectedAccount();
      setConnectedAccount(account);
    } catch (error) {
      console.error('Error fetching connected account:', error);
      toast({
        title: "Error",
        description: "Failed to load connected account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendars = async () => {
    setLoadingCalendars(true);
    try {
      const calendarList = await listCalendars();
      setCalendars(calendarList);
    } catch (error) {
      console.error('Error fetching calendars:', error);
      toast({
        title: "Error",
        description: "Failed to load calendars",
        variant: "destructive",
      });
    } finally {
      setLoadingCalendars(false);
    }
  };

  const handleDisconnect = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to disconnect your Google Calendar? This will remove access to your calendar data.'
    );

    if (!confirmed) return;

    const success = await disconnectCalendar();
    if (success) {
      setConnectedAccount(null);
      setCalendars([]);
    }
  };

  const connectOutlookCalendar = async () => {
    toast({
      title: "Coming Soon",
      description: "Outlook Calendar integration is being set up",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Calendar Connections</h1>
            <p className="text-gray-600">Connect your calendars to create your unified OneSlot view</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Status Banner */}
        {!connectedAccount ? (
          <Card className="p-6 mb-8 border-amber-200 bg-amber-50">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3" />
              <div>
                <h3 className="font-medium text-amber-800">No calendars connected</h3>
                <p className="text-amber-700 text-sm">Connect at least one calendar to start using OneSlot</p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-6 mb-8 border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-green-800">Google Calendar Connected</h3>
                  <p className="text-green-700 text-sm">{connectedAccount.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </Card>
        )}

        {/* Connected Calendars List */}
        {connectedAccount && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Calendars</h2>
            {loadingCalendars ? (
              <Card className="p-6">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading calendars...</span>
                </div>
              </Card>
            ) : calendars.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {calendars.map((calendar) => (
                  <Card key={calendar.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded mr-3"
                          style={{ backgroundColor: calendar.backgroundColor || '#4285f4' }}
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {calendar.summary}
                            {calendar.primary && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Primary
                              </span>
                            )}
                          </h3>
                          {calendar.description && (
                            <p className="text-sm text-gray-600">{calendar.description}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 capitalize">{calendar.accessRole}</span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6">
                <p className="text-gray-600 text-center">No calendars found</p>
              </Card>
            )}
          </div>
        )}

        {/* Available Connections */}
        {!connectedAccount && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Connections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Google Calendar */}
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Google Calendar</h3>
                    <p className="text-gray-600 text-sm">Connect your Google Calendar</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Sync your Google Calendar events to show accurate availability in your OneSlot.
                </p>
                <Button
                  onClick={initiateGoogleCalendarOAuth}
                  className="w-full bg-red-600 hover:bg-red-700"
                  disabled={calendarLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {calendarLoading ? 'Connecting...' : 'Connect Google Calendar'}
                </Button>
              </Card>

              {/* Outlook Calendar */}
              <Card className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Outlook Calendar</h3>
                    <p className="text-gray-600 text-sm">Connect your Microsoft Calendar</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Sync your Outlook Calendar events to show accurate availability in your OneSlot.
                </p>
                <Button
                  onClick={connectOutlookCalendar}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Outlook Calendar
                </Button>
              </Card>
            </div>
          </div>
        )}

        {/* Help Section */}
        <Card className="p-6 mt-8 bg-gray-50">
          <div className="flex items-start">
            <Settings className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-3">
                Connecting your calendars allows OneSlot to show your true availability by checking for conflicts 
                across all your calendar accounts.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Your calendar data is kept secure and private</li>
                <li>• We only read availability, not event details</li>
                <li>• You can disconnect at any time</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
