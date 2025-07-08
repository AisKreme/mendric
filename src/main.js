import { fetchEntries, saveEntry, updateEntry, deleteEntryById } from './api.js';
import { renderPage, renderTOC, renderTimelineMarkers } from './render.js';
import { editEntry } from './edit.js';
import { clearPreviews } from './upload.js'; // Funktion aus upload.js importieren

let entries = [];
let currentPage = 0;
let allEntries = [];

export let currentEntryId = null; // Aktuell sichtbare Eintrags-ID

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnPrev').addEventListener('click', prevPage);
  document.getElementById('btnNext').addEventListener('click', nextPage);
  document.getElementById('toc-toggle').addEventListener('click', () => {
    const toc = document.getElementById('toc');
    if (!toc) return;
    toc.classList.toggle('open');
  });
  document.getElementById('toggleEntryBtn').addEventListener('click', () => {
    const form = document.getElementById('entryForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  });
  document.getElementById('saveEntryBtn').addEventListener('click', addEntry);

  document.getElementById('searchChronik').addEventListener('input', () => {
    const query = document.getElementById('searchChronik').value.toLowerCase();
    const filtered = allEntries.filter(entry =>
      entry.note.toLowerCase().includes(query) ||
      (entry.flow && entry.flow.toLowerCase().includes(query)) ||
      (entry.kapitel && entry.kapitel.toLowerCase().includes(query))
    );
    renderFiltered(filtered);
  });

  loadEntries();
});

export async function loadEntries() {
  try {
    entries = await fetchEntries();
    allEntries = [...entries];
    if (entries.length > 0) {
      currentPage = entries.length - 1;
      setCurrentEntryId(entries[currentPage].id);
      onSelectPage(currentPage);
    } else {
      currentPage = 0;
      currentEntryId = null;
      clearPreviews();
      renderPage(null, 0, 0, onEdit, onDelete, speakText, speakText, '');
      renderTOC([], onSelectPage);
      renderTimelineMarkers([], onSelectPage);
    }
  } catch (e) {
    console.error('Fehler beim Laden:', e);
  }
}

function onEdit(entryDiv, entry) {
  editEntry(entryDiv, entry, loadEntries);
}

function onDelete(id) {
  if (!confirm('Diesen Eintrag wirklich löschen?')) return;
  deleteEntryById(id)
    .then(loadEntries)
    .catch(e => alert('Fehler beim Löschen: ' + e.message));
}

function setCurrentEntryId(id) {
  currentEntryId = id;
  window.uploadedImageURLs = []; // Upload-Zwischenspeicher leeren beim Seitenwechsel
  clearPreviews();
}

function onSelectPage(index) {
  currentPage = index;
  const entry = entries[currentPage];
  setCurrentEntryId(entry?.id || null);

  renderPage(
    entry,
    currentPage,
    entries.length,
    onEdit,
    onDelete,
    speakText,
    speakText,
    document.getElementById('searchChronik').value
  );
  renderTOC(allEntries, onSelectPage);
  renderTimelineMarkers(allEntries, onSelectPage);
}

export function prevPage() {
  if (currentPage > 0) {
    onSelectPage(currentPage - 1);
  }
}

export function nextPage() {
  if (currentPage < entries.length - 1) {
    onSelectPage(currentPage + 1);
  }
}

function speakText(text) {
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.85;
  utterance.pitch = 0.6;
  speechSynthesis.speak(utterance);
}

export async function addEntry() {
  const note = document.getElementById('noteInput').value.trim();
  const flow = document.getElementById('flowInput').value.trim();
  const kapitel = document.getElementById('kapitelInput').value.trim();
  const tagsRaw = document.getElementById('tagsInput').value.trim();
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const images = window.uploadedImageURLs || [];
  const date = new Date().toLocaleDateString('de-DE');

  if (kapitel) localStorage.setItem('lastKapitel', kapitel);
  if (!note) return alert('Notiz erforderlich');

  try {
    if (!currentEntryId) {
      // Neuen Eintrag speichern
      const savedEntry = await saveEntry({ note, flow, kapitel, tags, images, date });
      setCurrentEntryId(savedEntry.id);
    } else {
      // Existierenden Eintrag aktualisieren
      await updateEntry(currentEntryId, { note, flow, kapitel, tags, images, date });
    }
    // Formular zurücksetzen
    document.getElementById('noteInput').value = '';
    document.getElementById('flowInput').value = '';
    document.getElementById('kapitelInput').value = '';
    document.getElementById('tagsInput').value = '';
    window.uploadedImageURLs = [];
    clearPreviews();

    loadEntries();
  } catch (e) {
    alert('Fehler beim Speichern: ' + e.message);
  }
}

export function renderFiltered(filtered) {
  entries = filtered;
  if (entries.length > 0) {
    onSelectPage(0);
  } else {
    renderPage(null, 0, 0, onEdit, onDelete, speakText, speakText, '');
    clearPreviews();
  }
}