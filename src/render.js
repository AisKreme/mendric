// src/render.js

/**
 * Rendert eine einzelne Eintragsseite mit allen Buttons (Vorlesen, Bearbeiten, Löschen) und Tags.
 * @param {Object} entry - Eintragsobjekt mit {note, flow, kapitel, tags, date, id}
 * @param {number} index - Aktuelle Seitenzahl (0-basiert)
 * @param {number} total - Gesamtzahl der Einträge
 * @param {Function} onEdit - Callback für Bearbeiten (entryDiv, entry)
 * @param {Function} onDelete - Callback für Löschen (entryId)
 * @param {Function} onSpeakNote - Callback zum Vorlesen der Notiz
 * @param {Function} onSpeakFlow - Callback zum Vorlesen des Fließtexts
 * @param {string} searchQuery - Suchbegriff für Hervorhebung
 */
export function renderPage(entry, index, total, onEdit, onDelete, onSpeakNote, onSpeakFlow, searchQuery) {
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

  // Titel
  const title = document.createElement('h3');
  title.textContent = `📜 ${entry.date}`;
  div.appendChild(title);

  // Notiz mit Hervorhebung
  const note = document.createElement('p');
  note.innerHTML = highlightMatches(entry.note, searchQuery);
  div.appendChild(note);

  // Fließtext als Details-Summary mit Hervorhebung
  const flow = document.createElement('details');
  const summary = document.createElement('summary');
  summary.textContent = 'Fließtext anzeigen';
  const pre = document.createElement('pre');
  pre.innerHTML = highlightMatches(entry.flow || '(kein Fließtext)', searchQuery);
  flow.appendChild(summary);
  flow.appendChild(pre);
  div.appendChild(flow);

  // Buttons erzeugen mit Styling-Klassen
  const speakNoteBtn = document.createElement('button');
  speakNoteBtn.className = 'styled-button';
  speakNoteBtn.textContent = '🔊 Notiz';
  speakNoteBtn.onclick = () => onSpeakNote(entry.note);
  div.appendChild(speakNoteBtn);

  const speakFlowBtn = document.createElement('button');
  speakFlowBtn.className = 'styled-button';
  speakFlowBtn.textContent = '🔊 Fließtext';
  speakFlowBtn.onclick = () => onSpeakFlow(entry.flow || '');
  div.appendChild(speakFlowBtn);

  const editBtn = document.createElement('button');
  editBtn.className = 'styled-button action-button';
  editBtn.textContent = '✏️';
  editBtn.onclick = () => onEdit(div, entry);
  div.appendChild(editBtn);

  const delBtn = document.createElement('button');
  delBtn.className = 'styled-button action-button';
  delBtn.textContent = '🗑️';
  delBtn.onclick = () => onDelete(entry.id);
  div.appendChild(delBtn);

  // Tags anzeigen, falls vorhanden
  if (entry.tags?.length) {
    const tagWrap = document.createElement('div');
    tagWrap.style.marginTop = '0.5rem';
    tagWrap.innerHTML = entry.tags
      .map(tag => `<span style="background:#d8b977;color:#000;border-radius:4px;padding:0.2rem 0.4rem;margin-right:0.3rem;font-size:0.9rem;">#${tag}</span>`)
      .join(' ');
    div.appendChild(tagWrap);
  }

  book.appendChild(div);
  indicator.textContent = `Seite ${index + 1} von ${total}`;
}

/**
 * Hebt alle Suchbegriffe im Text hervor.
 * @param {string} text - Text, der durchsucht wird
 * @param {string} query - Suchbegriff
 * @returns {string} - HTML mit <mark> hervorgehobenen Begriffen
 */
function highlightMatches(text, query) {
  if (!query) return text;
  const re = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

/**
 * Rendert das Inhaltsverzeichnis (Kapitel-Gliederung).
 * @param {Array} entries - Array aller Einträge
 * @param {Function} onSelectPage - Callback bei Seitenwahl im TOC
 */
export function renderTOC(entries, onSelectPage) {
  const toc = document.getElementById('toc');
  if (!toc) return;
  toc.innerHTML = '';

  // Einträge gruppieren nach Kapitel
  const grouped = {};
  entries.forEach((entry, index) => {
    const key = entry.kapitel || '🗂️ Allgemein';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({ ...entry, index });
  });

  // Kapitel und deren Einträge ins TOC schreiben
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
      li.textContent = item.date;
      li.style.cursor = 'pointer';
      li.onclick = () => onSelectPage(item.index);
      ul.appendChild(li);
    });
    toc.appendChild(ul);
  }
}

/**
 * Rendert die Zeitleisten-Marker unter dem Buch.
 * @param {Array} entries - Array aller Einträge
 * @param {Function} onSelectPage - Callback bei Seitenwahl im Timeline-Marker
 */
export function renderTimelineMarkers(entries, onSelectPage) {
  const markerBar = document.getElementById('timelineMarkers');
  if (!markerBar) return;
  markerBar.innerHTML = '';

  const uniqueDates = {};
  entries.forEach((entry, index) => {
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
    marker.title = entries[index].kapitel || '';
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