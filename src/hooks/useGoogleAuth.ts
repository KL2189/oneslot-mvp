
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useGoogleAuth(onSuccess: (session: any) => void) {
  const signIn = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Google sign-in error:', error);
        throw error;
      }

      // The actual session will be handled by the auth state change listener
      // in useAuth, so we don't need to call onSuccess here
    } catch (error) {
      console.error('Google authentication failed:', error);
      throw error;
    }
  }, [onSuccess]);

  return signIn;
}
