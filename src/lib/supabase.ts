import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;
let isConfigured = false;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  isConfigured = true;
}

export { isConfigured };
export const getSupabase = () => supabase;

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
