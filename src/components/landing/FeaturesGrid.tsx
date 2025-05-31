
import { Calendar, Shield, Clock, Globe, Zap, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "One Link",
    description: "Share one link that checks all your calendars. No more back-and-forth scheduling.",
    gradient: "bg-gradient-primary",
  },
  {
    icon: Shield,
    title: "One Truth",
    description: "See your true availability. Our AI detects conflicts across all your calendars instantly.",
    gradient: "bg-gradient-secondary",
  },
  {
    icon: CheckCircle,
    title: "One Click",
    description: "Book meetings with one click. Stunning pages that impress clients and save time.",
    gradient: "bg-gradient-accent",
  },
  {
    icon: Globe,
    title: "One Place",
    description: "Manage all calendars in one place. Automatic timezone detection and conversion.",
    gradient: "bg-gradient-success",
  },
  {
    icon: Clock,
    title: "One Schedule",
    description: "Set complex availability rules once. Different hours for different types of meetings.",
    gradient: "bg-gradient-primary",
  },
  {
    icon: Calendar,
    title: "One System",
    description: "Calendar invites sent automatically. Email reminders keep everyone synchronized.",
    gradient: "bg-gradient-secondary",
  },
];

export const FeaturesGrid = () => {
  return (
    <section id="features" className="py-24 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything you need in{" "}
            <span className="gradient-text">one place</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every calendar. One simple view. Find your OneSlot where all your time comes together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card group animate-fade-in-up"
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
