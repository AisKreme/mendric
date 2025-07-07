const toggleDropzoneBtn = document.getElementById('toggleDropzoneBtn');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');

// Button togglet die Sichtbarkeit der Dropzone
toggleDropzoneBtn.addEventListener('click', () => {
  if (dropzone.classList.contains('visible')) {
    dropzone.classList.remove('visible');
    toggleDropzoneBtn.textContent = '🖼️ Bild hochladen';
    clearPreviews();
    fileInput.value = ''; // Reset Input
  } else {
    dropzone.classList.add('visible');
    toggleDropzoneBtn.textContent = '❌ Bild-Upload schließen';
  }
});

// Klick auf Dropzone öffnet den Dateiauswahl-Dialog
dropzone.addEventListener('click', () => {
  fileInput.click();
});

// Drag & Drop Events
dropzone.addEventListener('dragover', e => {
  e.preventDefault();
  dropzone.style.borderColor = '#f5cb6b';
});

dropzone.addEventListener('dragleave', e => {
  e.preventDefault();
  dropzone.style.borderColor = '#ccc';
});

dropzone.addEventListener('drop', e => {
  e.preventDefault();
  dropzone.style.borderColor = '#ccc';
  const files = e.dataTransfer.files;
  handleFiles(files);
});

// Wenn Nutzer Dateien auswählt
fileInput.addEventListener('change', () => {
  handleFiles(fileInput.files);
});

// Funktion zur Verarbeitung der Dateien
function handleFiles(files) {
  clearPreviews();
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue; // Nur Bilder
    const img = document.createElement('img');
    img.classList.add('preview-image');
    img.file = file;

    previewContainer.appendChild(img);

    const reader = new FileReader();
    reader.onload = (function(aImg) {
      return function(e) {
        aImg.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(file);
  }
}

// Alte Vorschaubilder entfernen
function clearPreviews() {
  previewContainer.innerHTML = '';
}