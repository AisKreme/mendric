import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  const allowedOrigins = ['https://mendric.vercel.app', 'http://localhost:5173'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Falls du es strikt willst, kannst du hier auch Fehler senden
    // return res.status(403).json({ error: 'Forbidden origin' });
    res.setHeader('Access-Control-Allow-Origin', '*'); // Alternativ für Entwicklung
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Preflight-Anfrage
  }

  // POST zum Aktualisieren der Bilder (spezieller Fall)
  if (req.method === 'POST' && req.body.isImageUpdate) {
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

  // Regulärer POST für neue Einträge
  if (req.method === 'POST') {
    const { note, flow, kapitel, tags, images, date } = req.body;
    if (!note || !date) return res.status(400).json({ error: 'note und date erforderlich' });

    const { error } = await supabase
      .from('chronik_entries')
      .insert([{ note, flow, kapitel, tags, images, date }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  // Einträge lesen
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('chronik_entries')
      .select('*')
      .order('id', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // Eintrag aktualisieren
  if (req.method === 'PUT') {
    const { id, ...updateData } = req.body;
    if (!id) return res.status(400).json({ error: 'id erforderlich' });

    const { data, error } = await supabase
      .from('chronik_entries')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data[0]);
  }

  // Eintrag löschen
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'id erforderlich' });

    const { error } = await supabase
      .from('chronik_entries')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  // Falls Methode nicht erlaubt
  return res.status(405).json({ error: 'Nur GET, POST, PUT und DELETE erlaubt' });
}