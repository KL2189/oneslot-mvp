
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, TrendingUp, Plus, Settings, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // Mock data
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
      title: "Conversion Rate",
      value: "89%",
      change: "+5%",
      icon: TrendingUp,
      gradient: "bg-gradient-success",
    },
  ];

  const upcomingMeetings = [
    {
      title: "Product Demo",
      time: "2:00 PM",
      attendee: "Sarah Johnson",
      type: "Sales Call",
      avatar: "SJ",
    },
    {
      title: "Design Review",
      time: "4:30 PM",
      attendee: "Michael Chen",
      type: "Team Meeting",
      avatar: "MC",
    },
    {
      title: "Strategy Session",
      time: "6:00 PM",
      attendee: "Emily Davis",
      type: "Consultation",
      avatar: "ED",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              New Meeting Type
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="glass-card p-6 rounded-xl animate-fade-in-up hover:scale-105 transition-transform duration-300"
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
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {upcomingMeetings.map((meeting, index) => (
                  <div
                    key={index}
                    className="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {meeting.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
                      <p className="text-gray-600 text-sm">{meeting.attendee}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{meeting.time}</p>
                      <p className="text-gray-500 text-sm">{meeting.type}</p>
                    </div>
                  </div>
                ))}
              </div>

              {upcomingMeetings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No meetings scheduled for today</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions & Calendar Preview */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="w-4 h-4 mr-3" />
                  New Meeting Type
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="w-4 h-4 mr-3" />
                  Share Booking Link
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-3" />
                  Connect Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-3" />
                  View Analytics
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">New booking from Sarah Johnson</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Calendar synced successfully</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">Meeting type updated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
