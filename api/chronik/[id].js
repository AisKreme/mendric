import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // CORS-Header setzen
 res.setHeader('Access-Control-Allow-Origin', 'https://mendric.vercel.app'); // In Produktion besser einschränken!
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight OPTIONS-Anfrage kurz beantworten
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

  // Falls weitere Methoden benötigt werden, hier ergänzen

  // Methode nicht erlaubt
  res.setHeader('Allow', 'PUT, OPTIONS');
  return res.status(405).json({ error: 'Method not allowed' });
}