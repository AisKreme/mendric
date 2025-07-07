import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {

    // CORS-Header setzen
  res.setHeader('Access-Control-Allow-Origin', '*'); // oder deinen Frontend-Origin z.B. http://localhost:5173
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Nur POST erlaubt' });
  }

  const { id, images } = req.body;

  if (!id || !images) {
    return res.status(400).json({ error: 'id und images erforderlich' });
  }

  const { error } = await supabase
    .from('chronik_entries')
    .update({ images })
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
}