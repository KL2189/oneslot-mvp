
import { Calendar, Shield, Clock, Globe, Zap, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Multi-Calendar Sync",
    description: "Sync Google, Outlook, Apple, and more. See all your commitments in one place.",
    gradient: "bg-gradient-primary",
  },
  {
    icon: Shield,
    title: "Smart Conflict Detection",
    description: "Never double-book again. Our AI detects conflicts across all your calendars.",
    gradient: "bg-gradient-secondary",
  },
  {
    icon: Zap,
    title: "Beautiful Booking Pages",
    description: "Impress clients with stunning, customizable booking pages that match your brand.",
    gradient: "bg-gradient-accent",
  },
  {
    icon: Globe,
    title: "Time Zone Intelligence",
    description: "Automatic detection and conversion. Book meetings without timezone confusion.",
    gradient: "bg-gradient-success",
  },
  {
    icon: Clock,
    title: "Custom Availability",
    description: "Set complex schedules with ease. Different hours for different types of meetings.",
    gradient: "bg-gradient-primary",
  },
  {
    icon: CheckCircle,
    title: "Instant Confirmations",
    description: "Calendar invites sent automatically. Email reminders keep everyone on track.",
    gradient: "bg-gradient-secondary",
  },
];

export const FeaturesGrid = () => {
  return (
    <section id="features" className="py-24 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need to manage your{" "}
            <span className="gradient-text">calendar</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to save you time and prevent scheduling conflicts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 ${feature.gradient} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
