import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL; // aus Umgebungsvariablen
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // sicher & privat

export const supabase = createClient(supabaseUrl, supabaseServiceKey);