
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
  console.log("🔐 PKCE: Generating code verifier");
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const verifier = btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  console.log("🔐 PKCE: Code verifier generated", { 
    length: verifier.length, 
    preview: verifier.substring(0, 10) + "..." 
  });
  return verifier;
}

// Generate code challenge from verifier
async function generateCodeChallenge(verifier: string) {
  console.log("🔐 PKCE: Generating code challenge from verifier");
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  console.log("🔐 PKCE: Code challenge generated", { 
    length: challenge.length, 
    preview: challenge.substring(0, 10) + "..." 
  });
  return challenge;
}

export function useGoogleAuth(onSuccess: (code: string, codeVerifier: string) => void) {
  const clientRef = useRef<any>(null);
  const codeVerifierRef = useRef<string>("");

  useEffect(() => {
    console.log("🚀 OAuth Hook: useEffect triggered", { 
      googleLoaded: !!window.google,
      accountsLoaded: !!window.google?.accounts,
      clientExists: !!clientRef.current 
    });

    if (window.google && window.google.accounts && !clientRef.current) {
      const initializeClient = async () => {
        try {
          console.log("🔧 OAuth Flow: Starting client initialization");
          
          // Phase 1: PKCE Parameter Generation
          const codeVerifier = generateCodeVerifier();
          const codeChallenge = await generateCodeChallenge(codeVerifier);
          codeVerifierRef.current = codeVerifier;

          console.log("🔧 OAuth Flow: PKCE parameters ready", {
            verifierStored: !!codeVerifierRef.current,
            verifierLength: codeVerifierRef.current.length,
            challengeLength: codeChallenge.length
          });

          // Phase 2: Google Client Configuration
          console.log("🔧 OAuth Flow: Configuring Google OAuth client", {
            clientId: GOOGLE_CLIENT_ID.substring(0, 20) + "...",
            scope: "openid email profile",
            challengeMethod: "S256"
          });

          clientRef.current = window.google.accounts.oauth2.initCodeClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: "openid email profile",
            ux_mode: "popup",
            code_challenge_method: "S256",
            code_challenge: codeChallenge,
            callback: (response: any) => {
              console.log("📥 OAuth Response: Received from Google", {
                timestamp: new Date().toISOString(),
                hasCode: !!response.code,
                hasError: !!response.error,
                codeLength: response.code?.length || 0,
                errorType: response.error || null
              });
              
              // Phase 3: Response Validation
              if (response.error) {
                console.error("❌ OAuth Error: Google returned error", response.error);
                return;
              }

              if (!response.code) {
                console.error("❌ OAuth Error: No authorization code received");
                return;
              }

              // Phase 4: Code Verifier Retrieval
              const storedVerifier = codeVerifierRef.current;
              console.log("📋 PKCE Verification: Checking stored verifier", {
                hasStoredVerifier: !!storedVerifier,
                storedVerifierLength: storedVerifier?.length || 0,
                verifierMatches: storedVerifier === codeVerifier,
                timeSinceGeneration: "tracking needed"
              });

              if (!storedVerifier) {
                console.error("❌ PKCE Error: Code verifier not found in storage");
                return;
              }

              // Phase 5: Success Callback
              console.log("✅ OAuth Success: Calling success handler", {
                codePreview: response.code.substring(0, 10) + "...",
                verifierPreview: storedVerifier.substring(0, 10) + "..."
              });
              
              onSuccess(response.code, storedVerifier);
            },
          });
          
          console.log("✅ OAuth Flow: Google client initialized successfully");
        } catch (error) {
          console.error("❌ OAuth Flow: Initialization failed", error);
        }
      };

      initializeClient();
    }
  }, [onSuccess]);

  const signIn = useCallback(() => {
    console.log("🎯 Sign-in: Button clicked", {
      timestamp: new Date().toISOString(),
      clientReady: !!clientRef.current,
      verifierStored: !!codeVerifierRef.current
    });
    
    if (clientRef.current) {
      try {
        console.log("🚀 Sign-in: Requesting authorization code from Google");
        clientRef.current.requestCode();
      } catch (error) {
        console.error("❌ Sign-in: Failed to request code", error);
      }
    } else {
      console.warn("⚠️ Sign-in: Google OAuth client not initialized");
    }
  }, []);

  return signIn;
}
