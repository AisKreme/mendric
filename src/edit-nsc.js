// src/edit-nsc.js
import { saveNSC } from './api-nsc.js';

export function editNSC(entryDiv, nsc, reloadCallback) {
  const nameInput = document.createElement('input');
  nameInput.value = nsc.name;
  nameInput.style.width = '100%';

  const roleInput = document.createElement('input');
  roleInput.value = nsc.rolle;
  roleInput.style.width = '100%';

  const infoArea = document.createElement('textarea');
  infoArea.value = nsc.info;
  infoArea.style.width = '100%';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = '💾 Speichern';
  saveBtn.onclick = async () => {
    const updated = {
      id: nsc.id,
      name: nameInput.value.trim(),
      rolle: roleInput.value.trim(),
      info: infoArea.value.trim()
    };
    try {
      await saveNSC(updated);
      reloadCallback();
    } catch (e) {
      alert('Fehler beim Speichern: ' + e.message);
    }
  };

  entryDiv.innerHTML = '';
  entryDiv.appendChild(nameInput);
  entryDiv.appendChild(roleInput);
  entryDiv.appendChild(infoArea);
  entryDiv.appendChild(saveBtn);
}