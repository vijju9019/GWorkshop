import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
// Get them from: https://supabase.com/dashboard → your project → Settings → API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    email?: string;
  };
};
