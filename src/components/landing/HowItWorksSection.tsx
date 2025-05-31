
import { Calendar, Link, CheckCircle } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Calendar,
    title: "Connect Your Calendars",
    description: "Link all your calendars in seconds. We support Google, Outlook, Apple, and more.",
    gradient: "bg-gradient-primary",
  },
  {
    number: "02",
    icon: Link,
    title: "Share Your Link",
    description: "Get a beautiful, customizable booking page. Share it anywhere, anytime.",
    gradient: "bg-gradient-secondary",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Get Booked",
    description: "People see your real availability and book when you're actually free.",
    gradient: "bg-gradient-accent",
  },
];

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in minutes, not hours. No complex setup required.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-primary rounded-full transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="relative text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Step number circle */}
                <div className="relative mx-auto mb-8">
                  <div className={`w-20 h-20 ${step.gradient} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-2xl mx-auto relative z-10`}>
                    {step.number}
                  </div>
                  {/* Pulse ring */}
                  <div className={`absolute inset-0 w-20 h-20 ${step.gradient} rounded-full opacity-20 animate-pulse-ring`}></div>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 ${step.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
