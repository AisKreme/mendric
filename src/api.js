const API_URL = 'https://mendric.vercel.app/api/chronik';
const supabase = window.supabase;

export async function fetchEntries() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch entries');
  return await res.json();
}

export async function saveEntry(entry) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to save entry');
  return await res.json();
}

export async function deleteEntryById(id) {
  const res = await fetch(API_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to delete entry');
  return await res.json();
}