import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xggxbesrpxyxyzyhnjpz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnZ3hiZXNycHh5eHl6eWhuanB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2NTg0MzksImV4cCI6MjA4NzIzNDQzOX0.uS_lEOKTnFVvX49mCKBl11UT8Wy9Pl4EYkLeOKsutaI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
