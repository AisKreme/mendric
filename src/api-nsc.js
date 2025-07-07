// src/api-nsc.js
const API_NSC = 'https://mendric.vercel.app/api/nscs';

export async function fetchNSCs() {
  const res = await fetch(API_NSC);
  if (!res.ok) throw new Error('Fehler beim Laden der NSCs');
  return await res.json();
}

export async function saveNSC(nsc) {
  const res = await fetch(API_NSC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nsc),
  });
  if (!res.ok) throw new Error('Fehler beim Speichern des NSC');
  return await res.json();
}

export async function deleteNSC(id) {
  const res = await fetch(API_NSC, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Fehler beim Löschen des NSC');
  return await res.json();
}