import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

interface DiagnosticResult {
  supabaseInitialized: boolean;
  currentSession: any;
  authProvider: any;
  urlParams: any;
  errors: string[];
}

export function OAuthDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);

  useEffect(() => {
    const runDiagnostics = async () => {
      const errors: string[] = [];
      
      console.log('🔍 OAuth Diagnostics: Starting comprehensive check');
      
      // 1. Check Supabase client initialization
      const supabaseInitialized = !!supabase;
      console.log('✅ Supabase client initialized:', supabaseInitialized);
      
      // 2. Check current session
      let currentSession = null;
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        currentSession = session;
        console.log('📊 Current session:', session ? 'Active' : 'None', error ? `Error: ${error.message}` : '');
        if (error) errors.push(`Session error: ${error.message}`);
      } catch (error) {
        console.error('❌ Session check failed:', error);
        errors.push(`Session check failed: ${error}`);
      }
      
      // 3. Check URL parameters
      const urlParams = {
        search: Object.fromEntries(new URLSearchParams(window.location.search)),
        hash: Object.fromEntries(new URLSearchParams(window.location.hash.substring(1))),
        full_url: window.location.href
      };
      console.log('📋 URL Parameters:', urlParams);
      
      // 4. Check for OAuth errors in URL
      if (urlParams.search.error || urlParams.hash.error) {
        const oauthError = urlParams.search.error || urlParams.hash.error;
        const errorDesc = urlParams.search.error_description || urlParams.hash.error_description;
        console.error('❌ OAuth Error in URL:', oauthError, errorDesc);
        errors.push(`OAuth error: ${oauthError} - ${errorDesc}`);
      }
      
      // 5. Test auth state listener
      const authListener = supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔄 Auth state change:', event, session ? 'Session exists' : 'No session');
      });
      
      setDiagnostics({
        supabaseInitialized,
        currentSession,
        authProvider: 'Google',
        urlParams,
        errors
      });
      
      // Cleanup
      setTimeout(() => {
        authListener.data.subscription.unsubscribe();
      }, 1000);
    };
    
    runDiagnostics();
  }, []);

  if (!diagnostics) {
    return <div>Running OAuth diagnostics...</div>;
  }

  return (
    <Card className="p-4 m-4 max-w-2xl">
      <h3 className="text-lg font-bold mb-4">OAuth Flow Diagnostics</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Supabase Client:</span> 
          <span className={diagnostics.supabaseInitialized ? 'text-green-600' : 'text-red-600'}>
            {diagnostics.supabaseInitialized ? '✅ Initialized' : '❌ Failed'}
          </span>
        </div>
        
        <div>
          <span className="font-medium">Current Session:</span> 
          <span className={diagnostics.currentSession ? 'text-green-600' : 'text-yellow-600'}>
            {diagnostics.currentSession ? '✅ Active' : '⚠️ None'}
          </span>
        </div>
        
        <div>
          <span className="font-medium">Current URL:</span> 
          <code className="text-xs bg-gray-100 p-1 rounded">{diagnostics.urlParams.full_url}</code>
        </div>
        
        {diagnostics.urlParams.search && Object.keys(diagnostics.urlParams.search).length > 0 && (
          <div>
            <span className="font-medium">URL Search Params:</span>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
              {JSON.stringify(diagnostics.urlParams.search, null, 2)}
            </pre>
          </div>
        )}
        
        {diagnostics.urlParams.hash && Object.keys(diagnostics.urlParams.hash).length > 0 && (
          <div>
            <span className="font-medium">URL Hash Params:</span>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1">
              {JSON.stringify(diagnostics.urlParams.hash, null, 2)}
            </pre>
          </div>
        )}
        
        {diagnostics.errors.length > 0 && (
          <div>
            <span className="font-medium text-red-600">Errors:</span>
            <ul className="text-red-600 text-xs mt-1">
              {diagnostics.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}