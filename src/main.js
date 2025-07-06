const API_URL = 'https://mendric.vercel.app/api/chronik';
const VERIFY_URL = 'https://mendric.vercel.app/api/verify-password';
let entries = [];
let currentPage = 0;

const openSound = new Audio('https://upload.wikimedia.org/wikipedia/commons/transcoded/3/3b/Magic_spell.ogg/Magic_spell.ogg.mp3');

async function loadEntries() {
  const res = await fetch(API_URL);
  entries = await res.json();
  if (entries.length > 0) currentPage = entries.length - 1;
  renderPage(currentPage);
  renderTOC();
}

function renderPage(index) {
  const book = document.getElementById('bookPages');
  const indicator = document.getElementById('pageIndicator');
  book.innerHTML = '';
  if (!entries.length) {
    book.innerHTML = '<p>Keine Einträge vorhanden.</p>';
    indicator.textContent = '';
    return;
  }
  currentPage = Math.max(0, Math.min(index, entries.length - 1));
  const entry = entries[currentPage];
  const div = document.createElement('div');
  div.className = 'entry';

  const title = document.createElement('h3');
  title.textContent = `📜 ${entry.date}`;
  const note = document.createElement('p');
  note.textContent = entry.note;

  const flow = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = 'Fließtext anzeigen';
  const pre = document.createElement('pre');
  pre.textContent = entry.flow || '(kein Fließtext)';
  flow.appendChild(summary);
  flow.appendChild(pre);

  const speakNoteBtn = document.createElement('button');
  speakNoteBtn.textContent = '🔊 Notiz';
  speakNoteBtn.onclick = () => speakText(entry.note);

  const speakFlowBtn = document.createElement('button');
  speakFlowBtn.textContent = '🔊 Fließtext';
  speakFlowBtn.onclick = () => speakText(entry.flow || '');

  const editBtn = document.createElement('button');
  editBtn.textContent = '📝 Bearbeiten';
  editBtn.onclick = () => editEntry(div, entry);

  const delBtn = document.createElement('button');
  delBtn.textContent = '🗑️ Löschen';
  delBtn.onclick = () => deleteEntry(entry.id);

  div.appendChild(title);
  div.appendChild(note);
  div.appendChild(flow);
  div.appendChild(speakNoteBtn);
  div.appendChild(speakFlowBtn);
  div.appendChild(editBtn);
  div.appendChild(delBtn);

  book.appendChild(div);
  indicator.textContent = `Seite ${currentPage + 1} von ${entries.length}`;
}

async function deleteEntry(id) {
  if (!confirm('Diesen Eintrag wirklich löschen?')) return;
  try {
    const res = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const result = await res.json();
    if (result.error) return alert('Fehler: ' + result.error);
    await loadEntries(); // lädt neu und springt zur letzten Seite
  } catch (e) {
    console.error('Fehler beim Löschen:', e);
    alert('Fehler beim Löschen.');
  }
}

window.loadEntries = loadEntries;
window.checkAccess = checkAccess;