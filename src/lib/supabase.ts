import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Resume {
  id: string;
  filename: string;
  file_path: string;
  file_url: string;
  uploaded_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}

export interface Portfolio {
  id: string;
  filename: string;
  file_path: string;
  file_url: string;
  uploaded_at: string;
  is_deleted: boolean;
  deleted_at: string | null;
}
