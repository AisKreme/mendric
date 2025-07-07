// src/upload.js

const supabase = window.supabase; // Greift auf das globale Supabase-Objekt zu

const toggleDropzoneBtn = document.getElementById('toggleDropzoneBtn');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');

// Toggle Dropzone Sichtbarkeit
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

// Upload-Funktion: Datei an Supabase Storage senden
async function uploadFile(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('chronik-images') // Bucketname
    .upload(fileName, file, { cacheControl: '3600', upsert: false });

  if (error) {
    alert('Upload-Fehler: ' + error.message);
    console.error(error);
    return null;
  }

  // Öffentliche URL abrufen (korrekt: publicUrl)
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

// Mehrere Dateien hochladen und URLs sammeln
async function uploadFiles(files) {
  const urls = [];
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue; // Nur Bilder akzeptieren
    const url = await uploadFile(file);
    if (url) urls.push(url);
  }
  return urls;
}

// Dateien verarbeiten: Upload + Vorschau anzeigen + URLs speichern
async function handleFiles(files) {
  clearPreviews();
  const urls = await uploadFiles(files);
  urls.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    img.title = "Klicke für Großansicht";
    img.style.cursor = 'pointer';
    img.onclick = () => window.open(url, '_blank');
    previewContainer.appendChild(img);
  });
  window.uploadedImageURLs = urls; // Globale Variable für Bild-URLs
}

// Alte Vorschaubilder entfernen
function clearPreviews() {
  previewContainer.innerHTML = '';
}