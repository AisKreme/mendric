import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.34.0/dist/supabase.min.js';

const supabaseUrl = 'https://siygzsqkkrtrgjzvmpvl.supabase.co'; // deine Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpeWd6c3Fra3J0cmdqenZtcHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjcyNzgsImV4cCI6MjA2NzQwMzI3OH0.4MiO2uothQafTgsMep3s-tfjVp1X99m-3BceiNLnpVA'; // dein Public Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);