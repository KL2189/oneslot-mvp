
import { useState } from "react";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const googleSignIn = useGoogleAuth(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  });

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - replace with actual auth logic
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength === 0) return "bg-gray-200";
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-yellow-500";
    if (strength <= 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength === 0) return "";
    if (strength <= 1) return "Weak";
    if (strength <= 2) return "Fair";
    if (strength <= 3) return "Good";
    return "Strong";
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
          {/* Logo */}
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

          {/* Features list */}
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
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign in to OneSlot</h1>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
                Create your OneSlot
              </Link>
            </p>
          </div>

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full py-3 border-2 hover:bg-gray-50"
              onClick={googleSignIn}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
            <Button variant="outline" className="w-full py-3 border-2 hover:bg-gray-50">
              <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continue with Facebook
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign in with email</span>
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

            {/* Forgot password link */}
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

          {/* Terms */}
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
