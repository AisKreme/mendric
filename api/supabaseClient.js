import dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY);
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

