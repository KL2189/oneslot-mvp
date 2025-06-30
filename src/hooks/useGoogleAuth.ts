import { useCallback, useEffect, useRef } from "react";

// Updated Google OAuth client ID
const GOOGLE_CLIENT_ID = "639598258036-a50afnl0abv4vn75596iu4um4d20dmtg.apps.googleusercontent.com";

declare global {
  interface Window {
    google?: any;
  }
}

// Generate code verifier for PKCE
function generateCodeVerifier() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Generate code challenge from verifier
async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function useGoogleAuth(onSuccess: (code: string, codeVerifier: string) => void) {
  const clientRef = useRef<any>(null);
  const codeVerifierRef = useRef<string>("");

  useEffect(() => {
    if (window.google && window.google.accounts && !clientRef.current) {
      const initializeClient = async () => {
        try {
          // Generate PKCE parameters
          const codeVerifier = generateCodeVerifier();
          const codeChallenge = await generateCodeChallenge(codeVerifier);
          codeVerifierRef.current = codeVerifier;

          clientRef.current = window.google.accounts.oauth2.initCodeClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: "openid email profile https://www.googleapis.com/auth/calendar.readonly",
            ux_mode: "popup",
            code_challenge_method: "S256",
            code_challenge: codeChallenge,
            callback: (response: any) => {
              console.log("OAuth response:", response);
              if (response.code) {
                onSuccess(response.code, codeVerifierRef.current);
              } else if (response.error) {
                console.error("OAuth error:", response.error);
              }
            },
          });
          console.log("Google OAuth client initialized with PKCE");
        } catch (error) {
          console.error("Failed to initialize Google OAuth:", error);
        }
      };

      initializeClient();
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
    }
  }, []);

  return signIn;
}
