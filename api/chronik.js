import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const password = process.env.CHRONIK_PASSWORD || 'Mendric';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('chronik_entries')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Fehler beim Abrufen:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { note, flow, date, password: pwInput } = req.body;

    if (pwInput !== password) {
      return res.status(403).json({ error: 'Zugriff verweigert – falsches Passwort' });
    }

    if (!note || !date) {
      return res.status(400).json({ error: 'note und date erforderlich' });
    }

    const { error } = await supabase
      .from('chronik_entries')
      .insert([{ note, flow, date }]);

    if (error) {
      console.error('Fehler beim Speichern:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Nur GET und POST erlaubt' });
}