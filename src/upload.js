// src/upload.js
import { supabase } from './supabaseClient.js';
import { updateEntry } from './api.js'; // API-Funktion zum Aktualisieren eines Eintrags (Bilder hinzufügen)

const toggleDropzoneBtn = document.getElementById('toggleDropzoneBtn');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');

let currentEntryId = null; // ID des aktuell angezeigten Eintrags, von außen setzen

// Funktion, um die aktuelle Eintrags-ID zu setzen (wird von main.js aufgerufen)
export function setCurrentEntryId(id) {
  currentEntryId = id;
}

// Toggle der Sichtbarkeit der Dropzone
toggleDropzoneBtn.addEventListener('click', () => {
  if (dropzone.style.display === 'block') {
    dropzone.style.display = 'none';
    toggleDropzoneBtn.textContent = '🖼️ Bild hochladen';
    clearPreviews();
    fileInput.value = '';
  } else {
    dropzone.style.display = 'block';
    toggleDropzoneBtn.textContent = '❌ Bild-Upload schließen';
  }
});

// Klick auf Dropzone öffnet Dateiauswahl-Dialog
dropzone.addEventListener('click', () => fileInput.click());

// Drag & Drop Effekte für Dropzone
dropzone.addEventListener('dragover', e => {
  e.preventDefault();
  dropzone.classList.add('dragover');
});
dropzone.addEventListener('dragleave', e => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
});
dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

// Datei-Auswahl per Dialog
fileInput.addEventListener('change', () => {
  handleFiles(fileInput.files);
});

// Upload einer einzelnen Datei zu Supabase Storage
async function uploadFile(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('chronik-images') // Bucket-Name anpassen falls nötig
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) {
    alert('Upload-Fehler: ' + error.message);
    console.error(error);
    return null;
  }

  const { publicUrl, error: urlError } = supabase.storage
    .from('chronik-images')
    .getPublicUrl(fileName);

  if (urlError) {
    alert('URL-Fehler: ' + urlError.message);
    console.error(urlError);
    return null;
  }
  return publicUrl;
}

// Upload mehrerer Dateien und Sammeln der URLs
async function uploadFiles(files) {
  const urls = [];
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue; // Nur Bilder akzeptieren
    const url = await uploadFile(file);
    if (url) urls.push(url);
  }
  return urls;
}

// Dateien verarbeiten: Upload, Vorschau, URLs speichern und Eintrag aktualisieren
export async function handleFiles(files) {
  clearPreviews();
  const urls = await uploadFiles(files);
  window.uploadedImageURLs = urls; // URLs global speichern

  // Vorschau der hochgeladenen Bilder anzeigen
  urls.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.title = "Klicke für Großansicht";
    img.style.cursor = 'pointer';
    img.onclick = () => window.open(url, '_blank');
    previewContainer.appendChild(img);
  });

  // Falls ein Eintrag aktiv ist, Bilder in den Eintrag schreiben
  if (currentEntryId && urls.length > 0) {
    try {
      await updateEntry(currentEntryId, { images: urls });
      alert('Bilder erfolgreich zum Eintrag hinzugefügt.');
    } catch (error) {
      alert('Fehler beim Aktualisieren der Bilder: ' + error.message);
      console.error(error);
    }
  }
}

// Alte Vorschaubilder entfernen
export function clearPreviews() {
  previewContainer.innerHTML = '';
}