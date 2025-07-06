const API_URL = 'https://mendric.vercel.app/api/chronik';

let entries = [];
let currentPage = 0;

async function loadEntries() {
  const res = await fetch(API_URL);
  entries = await res.json();
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

  const entry = entries[index];
  const div = document.createElement('div');
  div.className = 'entry';
  div.dataset.id = entry.id;

  const title = document.createElement('h3');
  title.textContent = `📜 ${entry.date}`;

  const note = document.createElement('p');
  note.textContent = entry.note;
  note.classList.add('note-display');

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
  indicator.textContent = `Seite ${index + 1} von ${entries.length}`;
}

function renderTOC() {
  const toc = document.getElementById('toc');
  const list = document.createElement('ul');
  toc.innerHTML = '<h3>📖 Inhaltsverzeichnis</h3>';
  entries.forEach((entry, i) => {
    const li = document.createElement('li');
    li.textContent = `Seite ${i + 1}: ${entry.date}`;
    li.onclick = () => {
      currentPage = i;
      renderPage(currentPage);
    };
    list.appendChild(li);
  });
  toc.appendChild(list);
}

function toggleTOC() {
  document.getElementById('toc').classList.toggle('open');
}

function nextPage() {
  if (currentPage < entries.length - 1) {
    currentPage++;
    renderPage(currentPage);
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderPage(currentPage);
  }
}

async function addEntry() {
  const note = document.getElementById('noteInput').value.trim();
  const flow = document.getElementById('flowInput').value.trim();
  const pw = document.getElementById('pwInput').value.trim();
  const date = new Date().toLocaleDateString('de-DE');

  if (!note || !pw) return alert('Bitte Notiz und Passwort eingeben!');
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note, flow, date, password: pw })
    });
    const result = await res.json();
    if (result.error) return alert('Fehler: ' + result.error);
    document.getElementById('noteInput').value = '';
    document.getElementById('flowInput').value = '';
    loadEntries();
  } catch (e) {
    console.error('Fehler beim Speichern:', e);
    alert('Fehler beim Speichern.');
  }
}

async function deleteEntry(id) {
  const pw = document.getElementById('pwInput').value.trim();
  if (!pw) return alert('Zum Löschen bitte Passwort eingeben.');
  if (!confirm('Diesen Eintrag wirklich löschen?')) return;
  try {
    const res = await fetch(API_URL, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, password: pw })
    });
    const result = await res.json();
    if (result.error) return alert('Fehler: ' + result.error);
    loadEntries();
  } catch (e) {
    console.error('Fehler beim Löschen:', e);
    alert('Fehler beim Löschen.');
  }
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.85;
  utterance.pitch = 0.6;
  speechSynthesis.speak(utterance);
}

function editEntry(div, entry) {
  const noteArea = document.createElement('textarea');
  noteArea.value = entry.note;

  const flowArea = document.createElement('textarea');
  flowArea.value = entry.flow || '';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = '💾 Speichern';
  saveBtn.onclick = async () => {
    const pw = document.getElementById('pwInput').value.trim();
    if (!pw) return alert('Zum Bearbeiten bitte Passwort eingeben.');
    const newNote = noteArea.value.trim();
    const newFlow = flowArea.value.trim();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote, flow: newFlow, date: entry.date, password: pw })
      });
      const result = await res.json();
      if (result.error) return alert('Fehler: ' + result.error);
      loadEntries();
    } catch (e) {
      console.error('Fehler beim Bearbeiten:', e);
      alert('Fehler beim Speichern.');
    }
  };

  div.innerHTML = '';
  div.appendChild(noteArea);
  div.appendChild(flowArea);
  div.appendChild(saveBtn);
}

window.addEntry = addEntry;
window.prevPage = prevPage;
window.nextPage = nextPage;
window.toggleTOC = toggleTOC;
window.onload = loadEntries;