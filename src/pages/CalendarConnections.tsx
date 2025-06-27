
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, Plus, Settings, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConnectedAccount {
  id: string;
  provider: string;
  email: string;
}

export default function CalendarConnections() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnectedAccounts();
  }, []);

  const fetchConnectedAccounts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('calendar_accounts')
        .select('id, provider, email')
        .eq('user_id', user.id);

      if (error) throw error;
      setConnectedAccounts(data || []);
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
      toast({
        title: "Error",
        description: "Failed to load connected accounts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const connectGoogleCalendar = async () => {
    toast({
      title: "Coming Soon",
      description: "Google Calendar integration is being set up",
    });
  };

  const connectOutlookCalendar = async () => {
    toast({
      title: "Coming Soon", 
      description: "Outlook Calendar integration is being set up",
    });
  };

  const disconnectAccount = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('calendar_accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Calendar disconnected successfully",
      });

      fetchConnectedAccounts();
    } catch (error) {
      console.error('Error disconnecting account:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect calendar",
        variant: "destructive",
      });
    }
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
        {connectedAccounts.length === 0 ? (
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
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h3 className="font-medium text-green-800">
                  {connectedAccounts.length} calendar{connectedAccounts.length > 1 ? 's' : ''} connected
                </h3>
                <p className="text-green-700 text-sm">Your OneSlot is ready to show unified availability</p>
              </div>
            </div>
          </Card>
        )}

        {/* Connected Accounts */}
        {connectedAccounts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Connected Calendars</h2>
            <div className="space-y-3">
              {connectedAccounts.map((account) => (
                <Card key={account.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 capitalize">{account.provider} Calendar</h3>
                        <p className="text-gray-600 text-sm">{account.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Connected
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => disconnectAccount(account.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Connections */}
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
                onClick={connectGoogleCalendar}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Connect Google Calendar
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
