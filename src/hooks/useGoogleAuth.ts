
import { useCallback, useEffect, useRef } from "react";

// Updated Google OAuth client ID
const GOOGLE_CLIENT_ID = "639598258036-a50afnl0abv4vn75596iu4um4d20dmtg.apps.googleusercontent.com";

declare global {
  interface Window {
    google?: any;
  }
}

export function useGoogleAuth(onSuccess: (tokenResponse: any) => void) {
  const clientRef = useRef<any>(null);

  useEffect(() => {
    if (window.google && window.google.accounts && !clientRef.current) {
      clientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly",
        callback: (response: any) => {
          if (response.access_token) {
            onSuccess(response);
          }
        },
      });
    }
  }, [onSuccess]);

  const signIn = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.requestAccessToken();
    } else {
      console.warn("Google OAuth client not initialized");
    }
  }, []);

  return signIn;
}
