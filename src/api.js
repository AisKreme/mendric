const API_URL = 'https://mendric.vercel.app/api/chronik';

/**
 * Lädt alle Einträge aus der API.
 * @returns {Promise<Array>} Array von Einträgen
 */
export async function fetchEntries() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch entries');
  return await res.json();
}

/**
 * Speichert einen neuen Eintrag.
 * @param {Object} entry - Der Eintrag mit Feldern wie note, flow, kapitel, tags, images, date
 * @returns {Promise<Object>} Gespeicherter Eintrag (inkl. id)
 */
export async function saveEntry(entry) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to save entry');
  return await res.json();
}

/**
 * Aktualisiert einen bestehenden Eintrag.
 * @param {string|number} id - ID des Eintrags
 * @param {Object} updates - Felder zum Aktualisieren
 * @returns {Promise<Object>} Aktualisierter Eintrag
 */
export async function updateEntry(id, updates) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT', // oder PATCH je nach Backend
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update entry');
  return await res.json();
}

/**
 * Aktualisiert die Bild-URLs eines Eintrags.
 * @param {string|number} id - ID des Eintrags
 * @param {Array<string>} images - Array mit Bild-URLs
 * @returns {Promise<Object>} Aktualisierter Eintrag
 */
export async function updateEntryImages(id, images) {
  const res = await fetch('https://mendric.vercel.app/api/chronik-images', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, images }),
  });
  if (!res.ok) throw new Error('Failed to update images');
  return await res.json();
}

/**
 * Löscht einen Eintrag per ID.
 * @param {string|number} id - ID des Eintrags
 * @returns {Promise<Object>} Antwort vom Server
 */
export async function deleteEntryById(id) {
  const res = await fetch(API_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to delete entry');
  return await res.json();
}