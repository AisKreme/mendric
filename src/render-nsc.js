// src/render-nsc.js
import { editNSC as editNSCInline } from './edit-nsc.js';

export function renderNSCs(list, onEdit, onDelete) {
  const container = document.getElementById('nscContainer');
  container.innerHTML = '';
  list.forEach(nsc => {
    const div = document.createElement('div');
    div.className = 'nsc-entry';
    div.innerHTML = `
      <h3>🧾 ${nsc.name}</h3>
      <p><strong>Rolle:</strong> ${nsc.rolle || '–'}</p>
      <p>${nsc.info || ''}</p>
      <div class="nsc-controls">
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">🗑️</button>
      </div>
    `;
    container.appendChild(div);

    div.querySelector('.edit-btn').onclick = () => onEdit(div, nsc);
    div.querySelector('.delete-btn').onclick = () => onDelete(nsc.id);
  });
}