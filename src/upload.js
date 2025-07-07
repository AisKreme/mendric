// src/upload.js
import { supabase } from './supabaseClient.js';

const toggleDropzoneBtn = document.getElementById('toggleDropzoneBtn');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');

// Sichtbarkeit der Dropzone toggeln
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

// Klick auf Dropzone öffnet Dateiauswahl
dropzone.addEventListener('click', () => fileInput.click());

// Drag & Drop Effekte
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

// Datei-Auswahl
fileInput.addEventListener('change', () => {
  handleFiles(fileInput.files);
});

// Upload-Funktion für eine einzelne Datei
async function uploadFile(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
  const { data, error } = await supabase.storage
    .from('chronik-images') // Bucket-Name
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) {
    alert('Upload-Fehler: ' + error.message);
    console.error(error);
    return null;
  }

  // Öffentliche URL erzeugen
  const { publicUrl, error: urlError } = supabase.storage
    .from('chronik-images')
    .getPublicUrl(fileName);

  if (urlError) {
    alert('URL-Fehler: ' + urlError.message);
    return null;
  }
  return publicUrl;
}

// Alle Dateien hochladen & URLs sammeln
async function uploadFiles(files) {
  const urls = [];
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue; // nur Bilder
    const url = await uploadFile(file);
    if (url) urls.push(url);
  }
  return urls;
}

// Dateien handhaben: Vorschau erzeugen + URLs speichern
async function handleFiles(files) {
  clearPreviews();
  const urls = await uploadFiles(files);
  urls.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.title = "Klicke für Großansicht";
    img.onclick = () => window.open(url, '_blank');
    previewContainer.appendChild(img);
  });
  window.uploadedImageURLs = urls; // globale Variable zum Speichern der URLs
}

function clearPreviews() {
  previewContainer.innerHTML = '';
}