
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

          console.log("Initializing Google OAuth with PKCE:", {
            codeVerifier: codeVerifier.substring(0, 10) + "...",
            codeChallenge: codeChallenge.substring(0, 10) + "..."
          });

          clientRef.current = window.google.accounts.oauth2.initCodeClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: "openid email profile",
            ux_mode: "popup",
            code_challenge_method: "S256",
            code_challenge: codeChallenge,
            callback: (response: any) => {
              console.log("OAuth response received:", {
                hasCode: !!response.code,
                hasError: !!response.error,
                codeVerifier: codeVerifierRef.current.substring(0, 10) + "..."
              });
              
              if (response.code && codeVerifierRef.current) {
                console.log("Calling onSuccess with code and verifier");
                onSuccess(response.code, codeVerifierRef.current);
              } else if (response.error) {
                console.error("OAuth error:", response.error);
              } else {
                console.error("Missing code or code verifier:", {
                  hasCode: !!response.code,
                  hasVerifier: !!codeVerifierRef.current
                });
              }
            },
          });
          console.log("Google OAuth client initialized successfully");
        } catch (error) {
          console.error("Failed to initialize Google OAuth:", error);
        }
      };

      initializeClient();
    }
  }, [onSuccess]);

  const signIn = useCallback(() => {
    console.log("Sign in clicked, client ready:", !!clientRef.current);
    if (clientRef.current) {
      try {
        console.log("Requesting authorization code...");
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
