const API_URL = 'https://mendric.vercel.app/api/chronik';

/**
 * Lädt alle Einträge.
 */
export async function fetchEntries() {
  const res = await fetch(`${API_URL}`);
  if (!res.ok) throw new Error('Failed to fetch entries');
  return await res.json();
}

/**
 * Speichert einen neuen Eintrag.
 */
export async function saveEntry(entry) {
  // Für neuen Eintrag ist isImageUpdate nicht gesetzt
  const res = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to save entry');
  return await res.json();
}

/**
 * Aktualisiert einen bestehenden Eintrag.
 */
export async function updateEntry(id, updates) {
  // updates müssen id enthalten oder id separat gesendet werden
  const payload = { id, ...updates };
  const res = await fetch(`${API_URL}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update entry');
  }
  return await res.json();
}

/**
 * Aktualisiert nur die Bilder eines Eintrags.
 * Nutzt POST mit Flag isImageUpdate.
 */
export async function updateEntryImages(id, images) {
  const res = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, images, isImageUpdate: true }),
  });
  if (!res.ok) throw new Error('Failed to update images');
  return await res.json();
}

/**
 * Löscht einen Eintrag per ID.
 */
export async function deleteEntryById(id) {
  const res = await fetch(`${API_URL}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to delete entry');
  return await res.json();
}