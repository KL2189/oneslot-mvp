
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://buteohtchnbywfkjwjhf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dGVvaHRjaG5ieXdma2p3amhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTI2NjIsImV4cCI6MjA2NDI4ODY2Mn0.XSPgy_IVTNf5PGhwKeq94Q9OCImqkcBsuIBJlZjp7_8'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    redirectTo: 'http://localhost:8080/auth/callback'
  }
})
