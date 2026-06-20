import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfelwfidldcvltiyvvcn.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy'; // Will need actual anon key

// Wait, I can just use the connection string to do this, or I can read .env.local to get the anon key.
