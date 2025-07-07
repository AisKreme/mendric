import { fetchEntries, saveEntry, deleteEntryById } from './api.js';
import { renderPage, renderTOC, renderTimelineMarkers } from './render.js';
import { editEntry } from './edit.js';

let entries = [];
let currentPage = 0;
let allEntries = [];

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnPrev').addEventListener('click', () => {
    prevPage();
  });

  document.getElementById('btnNext').addEventListener('click', () => {
    nextPage();
  });

  document.getElementById('toc-toggle').addEventListener('click', () => {
    const toc = document.getElementById('toc');
    if (!toc) return;
    toc.classList.toggle('open');
  });

  document.getElementById('toggleEntryBtn').addEventListener('click', () => {
    const form = document.getElementById('entryForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('saveEntryBtn').addEventListener('click', () => {
    addEntry();
  });
});

export async function loadEntries() {
  try {
    entries = await fetchEntries();
    allEntries = [...entries];
    if (entries.length > 0) currentPage = entries.length - 1;
    renderPage(
      entries[currentPage],
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
    .then(() => {
      loadEntries();
    })
    .catch(e => {
      alert('Fehler beim Löschen: ' + e.message);
    });
}

function onSelectPage(index) {
  currentPage = index;
  renderPage(
    entries[currentPage],
    currentPage,
    entries.length,
    onEdit,
    onDelete,
    speakText,
    speakText,
    document.getElementById('searchChronik').value
  );
}

export function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    onSelectPage(currentPage);
  }
}

export function nextPage() {
  if (currentPage < entries.length - 1) {
    currentPage++;
    onSelectPage(currentPage);
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

export function addEntry() {
  const note = document.getElementById('noteInput').value.trim();
  const flow = document.getElementById('flowInput').value.trim();
  const kapitel = document.getElementById('kapitelInput').value.trim();
  const tagsRaw = document.getElementById('tagsInput').value.trim();
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const images = window.uploadedImageURLs || []; // Bilder-URLs aus Upload
  const date = new Date().toLocaleDateString('de-DE');

  if (kapitel) localStorage.setItem('lastKapitel', kapitel);
  if (!note) return alert('Notiz erforderlich');

  saveEntry({ note, flow, kapitel, tags, images, date })
    .then(() => {
      document.getElementById('noteInput').value = '';
      document.getElementById('flowInput').value = '';
      document.getElementById('kapitelInput').value = '';
      document.getElementById('tagsInput').value = '';
      window.uploadedImageURLs = []; // Upload-Zwischenspeicher leeren
      clearPreviews(); // Dropzone-Vorschau löschen
      loadEntries();
    })
    .catch(e => {
      alert('Fehler beim Speichern: ' + e.message);
    });
}

export function renderFiltered(filtered) {
  entries = filtered;
  currentPage = 0;
  onSelectPage(currentPage);
}

window.onload = () => {
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
};