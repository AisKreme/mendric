export function renderPage(entry, currentPage, totalEntries, onEdit, onDelete, onSpeakNote, onSpeakFlow, searchQuery) {
  const book = document.getElementById('bookPages');
  const indicator = document.getElementById('pageIndicator');
  book.innerHTML = '';

  if (!entry) {
    book.innerHTML = '<p>Keine Einträge vorhanden.</p>';
    indicator.textContent = '';
    return;
  }

  const div = document.createElement('div');
  div.className = 'entry';

  const title = document.createElement('h3');
  title.textContent = `📜 ${entry.date}`;

  const note = document.createElement('p');
  note.innerHTML = highlightMatches(entry.note, searchQuery);

  const flow = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = 'Fließtext anzeigen';
  const pre = document.createElement('pre');
  pre.innerHTML = highlightMatches(entry.flow || '(kein Fließtext)', searchQuery);
  flow.appendChild(summary);
  flow.appendChild(pre);

  const speakNoteBtn = document.createElement('button');
  speakNoteBtn.textContent = '🔊 Notiz';
  speakNoteBtn.onclick = () => onSpeakNote(entry.note);

  const speakFlowBtn = document.createElement('button');
  speakFlowBtn.textContent = '🔊 Fließtext';
  speakFlowBtn.onclick = () => onSpeakFlow(entry.flow || '');

  const editBtn = document.createElement('button');
  editBtn.textContent = '📝 Bearbeiten';
  editBtn.onclick = () => onEdit(div, entry);

  const delBtn = document.createElement('button');
  delBtn.textContent = '🗑️ Löschen';
  delBtn.onclick = () => onDelete(entry.id);

  div.appendChild(title);
  div.appendChild(note);
  div.appendChild(flow);
  div.appendChild(speakNoteBtn);
  div.appendChild(speakFlowBtn);
  div.appendChild(editBtn);
  div.appendChild(delBtn);

  if (entry.tags?.length) {
    const tagWrap = document.createElement('div');
    tagWrap.style.marginTop = '0.5rem';
    tagWrap.innerHTML = entry.tags.map(tag => `<span style="background:#d8b977;color:#000;border-radius:4px;padding:0.2rem 0.4rem;margin-right:0.3rem;font-size:0.9rem;">#${tag}</span>`).join(' ');
    div.appendChild(tagWrap);
  }

  book.appendChild(div);
  indicator.textContent = `Seite ${currentPage + 1} von ${totalEntries}`;
}

export function highlightMatches(text, query) {
  if (!query) return text;
  const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&') + ')', 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

export function renderTOC(allEntries, onSelectPage) {
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
      li.onclick = () => onSelectPage(item.index);
      ul.appendChild(li);
    });
    toc.appendChild(ul);
  }
}

export function renderTimelineMarkers(allEntries, onSelectPage) {
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
    marker.onclick = () => onSelectPage(index);
    markerBar.appendChild(marker);
  });
}