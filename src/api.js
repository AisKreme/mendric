// src/api.js

const API_URL = 'https://mendric.vercel.app/api/chronik';

/**
 * Holt alle Einträge von der Backend-API.
 * @returns {Promise<Array>} Array mit Einträgen
 */
export async function fetchEntries() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch entries');
  return await res.json();
}

/**
 * Speichert einen Eintrag inklusive Metadaten und Bild-URLs.
 * @param {Object} entry - { note, flow, kapitel, tags, images, date }
 * @returns {Promise<Object>} Antwort der API
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
 * Löscht einen Eintrag per ID über die Backend-API.
 * @param {number} id - ID des zu löschenden Eintrags
 * @returns {Promise<Object>} Antwort der API
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