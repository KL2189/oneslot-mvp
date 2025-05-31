
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for individuals getting started",
    features: [
      "Connect 2 calendars",
      "1 meeting type",
      "Basic booking page",
      "Email notifications",
      "Mobile app access",
    ],
    gradient: "border-gray-200",
    buttonStyle: "btn-ghost text-gray-900 border-gray-300",
    popular: false,
  },
  {
    name: "Professional",
    price: "$12",
    period: "per month",
    description: "For professionals and small teams",
    features: [
      "Unlimited calendars",
      "Unlimited meeting types",
      "Custom branding",
      "Advanced scheduling",
      "Analytics & insights",
      "Priority support",
      "Custom domains",
    ],
    gradient: "gradient-border",
    buttonStyle: "btn-gradient",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large teams and organizations",
    features: [
      "Everything in Professional",
      "SSO & SAML",
      "Advanced security",
      "Custom integrations",
      "Dedicated support",
      "Custom contracts",
      "On-premise options",
    ],
    gradient: "border-gray-200",
    buttonStyle: "btn-ghost text-gray-900 border-gray-300",
    popular: false,
  },
];

export const PricingSection = () => {
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, <span className="gradient-text">transparent</span> pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl transition-all duration-500 hover:scale-105 animate-fade-in-up ${
                plan.popular
                  ? "glass-card shadow-2xl shadow-purple-500/25 scale-105"
                  : "border border-gray-200 bg-white"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary px-6 py-2 rounded-full text-white font-semibold text-sm shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period !== "contact us" && (
                    <span className="text-gray-600 ml-2">/ {plan.period}</span>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => navigate("/signup")}
                className={`w-full py-3 ${plan.buttonStyle}`}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
