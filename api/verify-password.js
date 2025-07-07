export default async function handler(req, res) {
  // CORS-Header setzen - für Produktion ggf. anpassen
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight OPTIONS-Anfrage
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Nur POST erlauben
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body;
  const expected = process.env.CHRONIK_PASSWORD;

  if (!password) {
    return res.status(400).json({ error: 'Passwort fehlt' });
  }
  if (password !== expected) {
    return res.status(403).json({ error: 'Falsches Passwort' });
  }

  return res.status(200).json({ success: true });
}