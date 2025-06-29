
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AnalyticsData {
  totalBookings: number;
  thisWeekBookings: number;
  totalMeetingTypes: number;
  averageDuration: number;
  recentBookings: Array<{
    id: string;
    guest_name: string;
    guest_email: string;
    start_time: string;
    meeting_type: string;
  }>;
}

export default function Analytics() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalBookings: 0,
    thisWeekBookings: 0,
    totalMeetingTypes: 0,
    averageDuration: 0,
    recentBookings: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;
    
    try {
      // Fetch total bookings
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('host_id', user.id);

      // Fetch this week's bookings
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count: thisWeekBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('host_id', user.id)
        .gte('start_time', oneWeekAgo.toISOString());

      // Fetch meeting types count
      const { count: totalMeetingTypes } = await supabase
        .from('meeting_types')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch average duration
      const { data: meetingTypes } = await supabase
        .from('meeting_types')
        .select('duration')
        .eq('user_id', user.id);

      const averageDuration = meetingTypes && meetingTypes.length > 0
        ? Math.round(meetingTypes.reduce((sum, mt) => sum + mt.duration, 0) / meetingTypes.length)
        : 0;

      // Fetch recent bookings with meeting type names
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select(`
          id,
          guest_name,
          guest_email,
          start_time,
          meeting_types(name)
        `)
        .eq('host_id', user.id)
        .order('start_time', { ascending: false })
        .limit(5);

      const formattedRecentBookings = recentBookings?.map(booking => ({
        id: booking.id,
        guest_name: booking.guest_name,
        guest_email: booking.guest_email,
        start_time: booking.start_time,
        meeting_type: (booking.meeting_types as any)?.name || 'Unknown'
      })) || [];

      setAnalytics({
        totalBookings: totalBookings || 0,
        thisWeekBookings: thisWeekBookings || 0,
        totalMeetingTypes: totalMeetingTypes || 0,
        averageDuration,
        recentBookings: formattedRecentBookings
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Bookings",
      value: analytics.totalBookings.toString(),
      icon: Calendar,
      gradient: "bg-gradient-primary",
    },
    {
      title: "This Week",
      value: analytics.thisWeekBookings.toString(),
      icon: Clock,
      gradient: "bg-gradient-secondary",
    },
    {
      title: "Meeting Types",
      value: analytics.totalMeetingTypes.toString(),
      icon: Users,
      gradient: "bg-gradient-accent",
    },
    {
      title: "Avg Duration",
      value: `${analytics.averageDuration}m`,
      icon: TrendingUp,
      gradient: "bg-gradient-success",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">View your booking statistics and insights</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={stat.title}
              className="p-6 animate-fade-in-up hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.gradient} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>

            {analytics.recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No bookings yet</p>
                <p className="text-gray-500 text-sm">Your recent bookings will appear here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{booking.guest_name}</h3>
                      <p className="text-gray-600 text-sm">{booking.meeting_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 text-sm">
                        {new Date(booking.start_time).toLocaleDateString()}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(booking.start_time).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Quick Insights</h2>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Booking Rate</p>
                  <p className="text-green-700 text-sm">Weekly average</p>
                </div>
                <div className="text-green-600 font-bold text-xl">
                  {analytics.thisWeekBookings > 0 ? `${Math.round((analytics.thisWeekBookings / 7) * 10) / 10}/day` : '0/day'}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Active Meeting Types</p>
                  <p className="text-blue-700 text-sm">Available for booking</p>
                </div>
                <div className="text-blue-600 font-bold text-xl">
                  {analytics.totalMeetingTypes}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-purple-900">Total Time Booked</p>
                  <p className="text-purple-700 text-sm">All time</p>
                </div>
                <div className="text-purple-600 font-bold text-xl">
                  {Math.round((analytics.totalBookings * analytics.averageDuration) / 60)}h
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
