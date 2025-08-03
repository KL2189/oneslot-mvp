import { useCallback, useEffect, useRef } from "react";

const GOOGLE_CLIENT_ID = "639598258036-a50afnl0abv4vn75596iu4um4d20dmtg.apps.googleusercontent.com";

declare global {
  interface Window {
    google?: any;
  }
}

export function useGoogleAuth(onSuccess: (credentialResponse: any) => void) {
  const clientRef = useRef<any>(null);

  useEffect(() => {
    if (window.google && window.google.accounts && !clientRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            console.log("OAuth response:", response);
            if (response.credential) {
              onSuccess(response);
            } else if (response.error) {
              console.error("OAuth error:", response.error);
            }
          },
        });
        clientRef.current = true;
        console.log("Google OAuth client initialized");
      } catch (error) {
        console.error("Failed to initialize Google OAuth:", error);
      }
    }
  }, [onSuccess]);

  const signIn = useCallback(() => {
    console.log("Sign in clicked");
    if (clientRef.current && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt();
      } catch (error) {
        console.error("Failed to prompt sign in:", error);
      }
    } else {
      console.warn("Google OAuth client not initialized");
    }
  }, []);

  return signIn;
}
