import { saveEntry } from './api.js';
import { loadEntries } from './main.js';

export function editEntry(entryDiv, entry, reloadEntries) {
  const noteInput = document.createElement('textarea');
  noteInput.value = entry.note;
  noteInput.style.width = '100%';
  noteInput.style.height = '100px';

  const flowInput = document.createElement('textarea');
  flowInput.value = entry.flow || '';
  flowInput.style.width = '100%';
  flowInput.style.height = '100px';

  const kapitelInput = document.createElement('input');
  kapitelInput.type = 'text';
  kapitelInput.value = entry.kapitel || '';
  kapitelInput.placeholder = 'Kapitel / Ort / Abschnitt';
  kapitelInput.style.width = '100%';

  const tagsInput = document.createElement('input');
  tagsInput.type = 'text';
  tagsInput.value = entry.tags ? entry.tags.join(', ') : '';
  tagsInput.placeholder = 'Tags (kommagetrennt)';
  tagsInput.style.width = '100%';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = '💾 Speichern';
  saveBtn.onclick = async () => {
    const updated = {
      id: entry.id,
      note: noteInput.value.trim(),
      flow: flowInput.value.trim(),
      kapitel: kapitelInput.value.trim(),
      tags: tagsInput.value.split(',').map(t => t.trim()).filter(Boolean),
      date: entry.date
    };
    try {
      await saveEntry(updated);
      reloadEntries();
    } catch (error) {
      alert('Fehler beim Speichern: ' + error.message);
    }
  };

  entryDiv.innerHTML = '';
  entryDiv.appendChild(noteInput);
  entryDiv.appendChild(flowInput);
  entryDiv.appendChild(kapitelInput);
  entryDiv.appendChild(tagsInput);
  entryDiv.appendChild(saveBtn);
}