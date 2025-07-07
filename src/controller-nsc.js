// src/controller-nsc.js
import { fetchNSCs, saveNSC, deleteNSC } from './api-nsc.js';
import { renderNSCs } from './render-nsc.js';
import { editNSC } from './edit-nsc.js';

let nscs = [];

export async function loadNSCs() {
  try {
    nscs = await fetchNSCs();
    filterNSCs(); // Initial anzeigen
  } catch (e) {
    alert('Fehler beim Laden der NSCs: ' + e.message);
  }
}

export function toggleNSCForm() {
  const form = document.getElementById('nscForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

export async function saveNewNSC() {
  const name = document.getElementById('nscName').value.trim();
  const rolle = document.getElementById('nscRolle').value.trim();
  const info = document.getElementById('nscInfo').value.trim();
  if (!name) return alert('Bitte Name eingeben.');
  try {
    await saveNSC({ name, rolle, info });
    document.getElementById('nscName').value = '';
    document.getElementById('nscRolle').value = '';
    document.getElementById('nscInfo').value = '';
    toggleNSCForm();
    await loadNSCs();
  } catch (e) {
    alert('Fehler beim Speichern: ' + e.message);
  }
}

export async function deleteNSCById(id) {
  if (!confirm('Diesen NSC wirklich löschen?')) return;
  try {
    await deleteNSC(id);
    await loadNSCs();
  } catch (e) {
    alert('Fehler beim Löschen: ' + e.message);
  }
}

export function editNSCEntry(entryDiv, nsc) {
  editNSC(entryDiv, nsc, loadNSCs);
}

export function filterNSCs() {
  const query = document.getElementById('searchField').value.toLowerCase();
  const filtered = nscs.filter(n =>
    n.name.toLowerCase().includes(query) ||
    (n.rolle && n.rolle.toLowerCase().includes(query)) ||
    (n.info && n.info.toLowerCase().includes(query))
  );
  renderNSCs(filtered, editNSCEntry, deleteNSCById);
}

document.getElementById('searchField').addEventListener('input', filterNSCs);
loadNSCs();