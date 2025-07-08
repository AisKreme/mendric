const API_URL = 'https://mendric.vercel.app/api';

/** ... **/

export async function fetchEntries() {
  const res = await fetch(`${API_URL}/chronik`);
  if (!res.ok) throw new Error('Failed to fetch entries');
  return await res.json();
}

export async function saveEntry(entry) {
  const res = await fetch(`${API_URL}/chronik`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error('Failed to save entry');
  return await res.json();
}

export async function updateEntry(id, updates) {
  const res = await fetch(`${API_URL}/chronik/id`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update entry');
  }
  return await res.json();
}

export async function updateEntryImages(id, images) {
  const res = await fetch(`${API_URL}/chronik/id`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, images }),
  });
  if (!res.ok) throw new Error('Failed to update images');
  return await res.json();
}

export async function deleteEntryById(id) {
  const res = await fetch(`${API_URL}/chronik`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Failed to delete entry');
  return await res.json();
}