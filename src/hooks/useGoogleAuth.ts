
import { useCallback, useEffect, useRef } from "react";

// Updated Google OAuth client ID
const GOOGLE_CLIENT_ID = "639598258036-a50afnl0abv4vn75596iu4um4d20dmtg.apps.googleusercontent.com";

declare global {
  interface Window {
    google?: any;
  }
}

export function useGoogleAuth(onSuccess: (code: string) => void) {
  const clientRef = useRef<any>(null);

  useEffect(() => {
    console.log("Google object:", window.google);
    console.log("Google accounts:", window.google?.accounts);
    
    if (window.google && window.google.accounts && !clientRef.current) {
      try {
        clientRef.current = window.google.accounts.oauth2.initCodeClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly",
          ux_mode: "popup",
          callback: (response: any) => {
            console.log("OAuth response:", response);
            if (response.code) {
              onSuccess(response.code);
            } else if (response.error) {
              console.error("OAuth error:", response.error);
            }
          },
        });
        console.log("Google OAuth client initialized");
      } catch (error) {
        console.error("Failed to initialize Google OAuth:", error);
      }
    }
  }, [onSuccess]);

  const signIn = useCallback(() => {
    console.log("Sign in clicked, client:", clientRef.current);
    if (clientRef.current) {
      try {
        clientRef.current.requestCode();
      } catch (error) {
        console.error("Failed to request code:", error);
      }
    } else {
      console.warn("Google OAuth client not initialized");
      // Try to initialize again
      if (window.google && window.google.accounts) {
        console.log("Attempting to reinitialize...");
        // Trigger re-initialization
        window.location.reload();
      }
    }
  }, []);

  return signIn;
}