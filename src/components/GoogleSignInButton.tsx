
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface GoogleSignInButtonProps {
  mode: "signin" | "signup";
}

export function GoogleSignInButton({ mode }: GoogleSignInButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    console.log('🚀 OAuth Flow: Starting Supabase native OAuth');
    setIsLoading(true);
    
    try {
      // Phase 1: Configuration Check
      console.log('🔧 OAuth Config: Checking Supabase client', {
        clientInitialized: !!supabase,
        timestamp: new Date().toISOString()
      });

      // Phase 2: OAuth Flow Initiation
      const redirectTo = `${window.location.origin}/dashboard`;
      console.log('🔄 OAuth Flow: Initiating signInWithOAuth', {
        provider: 'google',
        redirectTo,
        currentUrl: window.location.href
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          scopes: 'email profile'
        }
      });

      // Phase 3: Response Analysis
      console.log('📊 OAuth Response: Supabase signInWithOAuth result', {
        hasData: !!data,
        hasError: !!error,
        dataProperties: data ? Object.keys(data) : [],
        errorMessage: error?.message,
        errorStatus: error?.status
      });

      if (error) {
        console.error('❌ OAuth Error: Supabase signInWithOAuth failed', {
          message: error.message,
          status: error.status,
          name: error.name,
          fullError: error
        });
        
        toast({
          title: "Authentication Failed",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
      } else {
        console.log('✅ OAuth Success: Redirect initiated', {
          url: data.url,
          provider: data.provider
        });
        
        // Note: We don't set loading to false here because we're redirecting
        // The page will change, so the component will unmount
      }
    } catch (error) {
      console.error('❌ OAuth Exception: Unexpected error in OAuth flow', {
        error: error,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      toast({
        title: "Error",
        description: "Failed to initiate Google authentication",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full py-3 border-2 hover:bg-gray-50 transition-colors"
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {isLoading ? "Redirecting..." : mode === "signin" ? "Sign in with Google" : "Sign up with Google"}
    </Button>
  );
}
