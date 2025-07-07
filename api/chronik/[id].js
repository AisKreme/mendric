import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // Setze CORS-Header
  res.setHeader('Access-Control-Allow-Origin', '*');  // Für Entwicklung: "*" oder spezifische URL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS-Anfrage direkt beenden
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (req.method === 'PUT') {
    const updates = req.body;

    const { error } = await supabase
      .from('chronik_entries')
      .update(updates)
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ success: true });
  }

  // Weitere Methoden, falls benötigt

  res.status(405).json({ error: 'Method not allowed' });
}