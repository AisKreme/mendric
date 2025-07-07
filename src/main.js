const API_URL = 'https://mendric.vercel.app/api/chronik';
let entries = [];
let currentPage = 0;
let allEntries = [];

async function loadEntries() {
  try {
    const res = await fetch(API_URL);
    entries = await res.json();
    allEntries = [...entries];
    if (entries.length > 0) currentPage = entries.length - 1;
    renderPage(currentPage);
    renderTOC();
    renderTimelineMarkers();
  } catch (e) {
    console.error('Fehler beim Laden:', e);
  }
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
  note.innerHTML = highlightMatches(entry.note, document.getElementById("searchChronik").value);

  const flow = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = 'Fließtext anzeigen';
  const pre = document.createElement('pre');
  pre.innerHTML = highlightMatches(entry.flow || '(kein Fließtext)', document.getElementById("searchChronik").value);
  flow.appendChild(summary);
  flow.appendChild(pre);

  const speakNoteBtn = document.createElement('button');
  speakNoteBtn.textContent = '🔊 Notiz';
  speakNoteBtn.onclick = () => speakText(entry.note);

  const speakFlowBtn = document.createElement('button');
  speakFlowBtn.textContent = '🔊 Fließtext';
  speakFlowBtn.onclick = () => speakText(entry.flow || '');

  const delBtn = document.createElement('button');
  delBtn.textContent = '🗑️ Löschen';
  delBtn.onclick = () => deleteEntry(entry.id);

  div.appendChild(title);
  div.appendChild(note);
  div.appendChild(flow);
  div.appendChild(speakNoteBtn);
  div.appendChild(speakFlowBtn);
  div.appendChild(delBtn);

  if (entry.tags?.length) {
    const tagWrap = document.createElement('div');
    tagWrap.style.marginTop = '0.5rem';
    tagWrap.innerHTML = entry.tags.map(tag => `<span style="background:#d8b977;color:#000;border-radius:4px;padding:0.2rem 0.4rem;margin-right:0.3rem;font-size:0.9rem;">#${tag}</span>`).join(' ');
    div.appendChild(tagWrap);
  }

  book.appendChild(div);
  indicator.textContent = `Seite ${currentPage + 1} von ${entries.length}`;
}

function highlightMatches(text, query) {
  if (!query) return text;
  const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\$&') + ')', 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

document.getElementById("searchChronik").addEventListener("input", () => {
  const query = document.getElementById("searchChronik").value.toLowerCase();
  const filtered = allEntries.filter(entry =>
    entry.note.toLowerCase().includes(query) ||
    (entry.flow && entry.flow.toLowerCase().includes(query)) ||
    (entry.kapitel && entry.kapitel.toLowerCase().includes(query))
  );
  renderFiltered(filtered);
});

function renderFiltered(filtered) {
  entries = filtered;
  currentPage = 0;
  renderPage(currentPage);
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderPage(currentPage);
  }
}
function nextPage() {
  if (currentPage < entries.length - 1) {
    currentPage++;
    renderPage(currentPage);
  }
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'de-DE';
  utterance.rate = 0.85;
  utterance.pitch = 0.6;
  speechSynthesis.speak(utterance);
}

function deleteEntry(id) {
  if (!confirm("Diesen Eintrag wirklich löschen?")) return;
  fetch(API_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  })
    .then(res => res.json())
    .then(() => {
      loadEntries();
    });
}

function addEntry() {
  const note = document.getElementById("noteInput").value.trim();
  const flow = document.getElementById("flowInput").value.trim();
  const kapitel = document.getElementById("kapitelInput").value.trim();
  const tagsRaw = document.getElementById("tagsInput").value.trim();
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const date = new Date().toLocaleDateString("de-DE");

  if (kapitel) localStorage.setItem("lastKapitel", kapitel);
  if (!note) return alert("Notiz erforderlich");

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ note, flow, kapitel, tags, date })
  })
    .then(res => res.json())
    .then(() => {
      document.getElementById("noteInput").value = '';
      document.getElementById("flowInput").value = '';
      document.getElementById("kapitelInput").value = '';
      document.getElementById("tagsInput").value = '';
      loadEntries();
    });
}

function renderTOC() {
  const toc = document.getElementById('toc');
  toc.innerHTML = '';
  const grouped = {};
  allEntries.forEach((entry, index) => {
    const key = entry.kapitel || '🗂️ Allgemein';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ ...entry, index });
  });

  for (const kapitel in grouped) {
    const kapHead = document.createElement('h4');
    kapHead.textContent = kapitel;
    kapHead.style.marginTop = '0.8rem';
    kapHead.style.color = '#ffe792';
    toc.appendChild(kapHead);

    const ul = document.createElement('ul');
    ul.style.marginBottom = '0.5rem';
    grouped[kapitel].forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.date}`;
      li.style.cursor = 'pointer';
      li.onclick = () => {
        currentPage = item.index;
        renderPage(item.index);
      };
      ul.appendChild(li);
    });
    toc.appendChild(ul);
  }
}

function renderTimelineMarkers() {
  const markerBar = document.getElementById('timelineMarkers');
  if (!markerBar) return;
  markerBar.innerHTML = '';

  const uniqueDates = {};
  allEntries.forEach((entry, index) => {
    if (!uniqueDates[entry.date]) {
      uniqueDates[entry.date] = index;
    }
  });

  const sortedDates = Object.entries(uniqueDates).sort(([a], [b]) => {
    const [dayA, monthA, yearA] = a.split('.');
    const [dayB, monthB, yearB] = b.split('.');
    return new Date(`${yearA}-${monthA}-${dayA}`) - new Date(`${yearB}-${monthB}-${dayB}`);
  });

  sortedDates.forEach(([date, index]) => {
    const marker = document.createElement('button');
    marker.textContent = date;
    marker.title = allEntries[index].kapitel || '';
    marker.style.padding = '0.3rem 0.6rem';
    marker.style.borderRadius = '6px';
    marker.style.border = '1px solid #999';
    marker.style.background = '#2c2b29';
    marker.style.color = '#fffbe8';
    marker.style.cursor = 'pointer';
    marker.style.margin = '0.2rem';
    marker.onclick = () => {
      currentPage = index;
      renderPage(index);
    };
    markerBar.appendChild(marker);
  });
}
function toggleTOC() {
  const toc = document.getElementById('toc');
  if (!toc) return;
  toc.style.display = (toc.style.display === 'none') ? 'block' : 'none';
}