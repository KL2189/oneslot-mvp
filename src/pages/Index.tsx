
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Globe, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";
import { Navigation } from "@/components/landing/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-mesh overflow-hidden">
      <Navigation />
      <HeroSection />
      <FeaturesGrid />
      <HowItWorksSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
