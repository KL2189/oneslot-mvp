import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credentialResponse.credential,
      });

      if (error) {
        throw error;
      }

      // everything worked—send them on to the dashboard
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Authentication failed",
        description: err.message || "Could not sign you in with Google.",
        variant: "destructive",
      });
    }
  };

  const signInWithGoogle = useGoogleAuth(handleGoogleSuccess);

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
      <Button
        type="button"
        variant="outline"
        className="w-full py-3 flex items-center justify-center"
        onClick={signInWithGoogle}
      >
        {/* your Google SVG here */}
        Sign in with Google
      </Button>
    </div>
  );
}
