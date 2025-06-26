
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { FloatingCalendarCards } from "./FloatingCalendarCards";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-60"></div>
      <FloatingCalendarCards />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card text-sm font-medium text-gray-700 mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Used by 10,000+ professionals worldwide
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            All calendars.{" "}
            <span className="gradient-text">One view.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed text-balance">
            Stop juggling multiple calendars. OneSlot shows your true availability across Google, Outlook, and more.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={() => navigate("/signup")}
              className="btn-gradient text-lg px-10 py-6 min-w-[200px]"
            >
              Get Your OneSlot
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-2 border-gray-300 text-gray-700 font-semibold px-10 py-6 min-w-[200px] text-lg rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-gray-400 hover:text-gray-800 group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              See How It Works
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-gray-500">Trusted by teams at</p>
            <div className="flex items-center space-x-8 opacity-60">
              {["Google", "Microsoft", "Apple", "Slack", "Notion"].map((company) => (
                <div
                  key={company}
                  className="text-gray-400 font-semibold text-lg hover:text-gray-600 transition-colors"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};
