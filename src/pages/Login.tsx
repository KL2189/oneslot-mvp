
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { Mail, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user } = useAuth();

  // Handle redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 p-8 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center max-w-md">
          <div className="flex items-center space-x-3 mb-8">
            <div className="relative w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
            </div>
            <span className="text-2xl font-bold">OneSlot</span>
          </div>

          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Welcome back to your OneSlot
          </h1>
          <p className="text-purple-100 text-lg mb-8 leading-relaxed">
            Access your unified calendar view and never miss a meeting again.
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
              <span className="text-purple-100">All calendars in one view</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
              <span className="text-purple-100">Real-time availability</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
              <span className="text-purple-100">Smart scheduling</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </button>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to OneSlot</h1>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                Create your OneSlot
              </Link>
            </p>
          </div>

          {/* Google Sign In */}
          <div className="mb-6">
            <GoogleSignInButton mode="signin" />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className="pl-10 py-3 border-2 focus:border-purple-500 focus:ring-purple-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-1 block">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  className="pl-10 py-3 border-2 focus:border-purple-500 focus:ring-purple-200"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <Link to="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Forgot your password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in to OneSlot"
              )}
            </Button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-6">
            By signing in, you agree to our{" "}
            <Link to="#" className="text-purple-600 hover:text-purple-700">Terms of Service</Link>{" "}
            and{" "}
            <Link to="#" className="text-purple-600 hover:text-purple-700">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
