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
  div.innerHTML = `
    <h3>📜 ${entry.date}</h3>
    <p>${entry.note}</p>
    <details><summary>Fließtext anzeigen</summary><pre>${entry.flow || '(kein Fließtext)'}</pre></details>
    <button onclick="speakText(\\`${entry.note.replace(/`/g, '\\`')}\\`)">🔊 Vorlesen</button>
    <button onclick="deleteEntry(${entry.id})">🗑️ Löschen</button>
  `;
  book.appendChild(div);
  indicator.textContent = \`Seite \${index + 1} von \${entries.length}\`;
}

function renderTOC() {
  const toc = document.getElementById('toc');
  toc.innerHTML = '<h3>📖 Inhaltsverzeichnis</h3>';
  const list = document.createElement('ul');
  entries.forEach((entry, i) => {
    const li = document.createElement('li');
    li.innerHTML = \`Seite \${i + 1}: \${entry.date}\`;
    li.style.cursor = 'pointer';
    li.onclick = () => {
      currentPage = i;
      renderPage(currentPage);
    };
    list.appendChild(li);
  });
  toc.appendChild(list);
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

window.addEntry = addEntry;
window.onload = loadEntries;
window.prevPage = prevPage;
window.nextPage = nextPage;