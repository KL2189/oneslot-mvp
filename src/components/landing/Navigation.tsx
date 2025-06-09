
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-0 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/44f80683-f225-4dba-b579-3134f62c29af.png" 
              alt="OneSlot Logo" 
              className="w-8 h-8"
            />
            <span className="text-xl font-bold gradient-text">OneSlot</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-gray-900 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-gray-900 transition-colors">
              How it Works
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-gray-900 transition-colors">
              Pricing
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/login")}
              className="text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Button>
            <Button
              onClick={() => navigate("/signup")}
              className="btn-gradient relative z-10"
            >
              Get Your OneSlot
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 glass-card-dark rounded-xl mt-2 mx-4">
            <div className="flex flex-col space-y-4 px-4">
              <a href="#features" className="text-white hover:text-gray-300 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-white hover:text-gray-300 transition-colors">
                How it Works
              </a>
              <a href="#pricing" className="text-white hover:text-gray-300 transition-colors">
                Pricing
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login")}
                  className="text-white justify-start"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate("/signup")}
                  className="btn-gradient"
                >
                  Get Your OneSlot
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
