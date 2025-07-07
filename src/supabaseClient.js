import { createClient } from '../@supabase/supabase-js';

const supabaseUrl = 'https://siygzsqkkrtrgjzvmpvl.supabase.co'; // ersetze mit deinem Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpeWd6c3Fra3J0cmdqenZtcHZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MjcyNzgsImV4cCI6MjA2NzQwMzI3OH0.4MiO2uothQafTgsMep3s-tfjVp1X99m-3BceiNLnpVA';             // ersetze mit deinem Public Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);