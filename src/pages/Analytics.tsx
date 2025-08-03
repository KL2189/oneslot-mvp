
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Users, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Analytics() {
  const navigate = useNavigate();

  // Mock data for demonstration
  const stats = [
    {
      title: "Total Bookings",
      value: "127",
      change: "+12%",
      icon: Calendar,
      gradient: "bg-gradient-primary",
    },
    {
      title: "This Week",
      value: "23",
      change: "+8%",
      icon: Clock,
      gradient: "bg-gradient-secondary",
    },
    {
      title: "Meeting Types",
      value: "6",
      change: "+2",
      icon: Users,
      gradient: "bg-gradient-accent",
    },
    {
      title: "Avg Duration",
      value: "45m",
      change: "+5%",
      icon: TrendingUp,
      gradient: "bg-gradient-success",
    },
  ];

  const recentBookings = [
    {
      id: "1",
      guest_name: "Sarah Johnson",
      start_time: new Date().toISOString(),
      meeting_type: "Product Demo"
    },
    {
      id: "2", 
      guest_name: "Michael Chen",
      start_time: new Date(Date.now() - 86400000).toISOString(),
      meeting_type: "Strategy Session"
    },
    {
      id: "3",
      guest_name: "Emily Davis", 
      start_time: new Date(Date.now() - 172800000).toISOString(),
      meeting_type: "Consultation"
    }
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
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
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

            <div className="space-y-4">
              {recentBookings.map((booking) => (
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
                <div className="text-green-600 font-bold text-xl">3.3/day</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Active Meeting Types</p>
                  <p className="text-blue-700 text-sm">Available for booking</p>
                </div>
                <div className="text-blue-600 font-bold text-xl">6</div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-purple-900">Total Time Booked</p>
                  <p className="text-purple-700 text-sm">All time</p>
                </div>
                <div className="text-purple-600 font-bold text-xl">95h</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
