// src/upload.js

const supabase = window.supabaseClient;

const toggleDropzoneBtn = document.getElementById('toggleDropzoneBtn');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');

dropzone.style.display = 'none';

toggleDropzoneBtn.addEventListener('click', () => {
  if (dropzone.style.display === 'none') {
    dropzone.style.display = 'block';
    toggleDropzoneBtn.textContent = '❌ Bild-Upload schließen';
  } else {
    dropzone.style.display = 'none';
    toggleDropzoneBtn.textContent = '🖼️ Bild hochladen';
    clearPreviews();
    fileInput.value = '';
  }
});

dropzone.addEventListener('click', () => fileInput.click());
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
  handleFiles(e.dataTransfer.files);
});
fileInput.addEventListener('change', () => handleFiles(fileInput.files));

async function uploadFile(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = fileName;

  const { data, error } = await supabase.storage
    .from('chronik-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: false });

  if (error) {
    console.error('Upload-Fehler:', error);
    alert('Fehler beim Hochladen: ' + error.message);
    return null;
  }
  return filePath;
}

async function uploadFiles(files) {
  const urls = [];
  for (const file of files) {
    const path = await uploadFile(file);
    if (path) {
      const { publicURL, error } = supabase.storage.from('chronik-images').getPublicUrl(path);
      if (!error) urls.push(publicURL);
    }
  }
  return urls;
}

async function handleFiles(files) {
  clearPreviews();
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const img = document.createElement('img');
    img.classList.add('preview-image');
    previewContainer.appendChild(img);
    const reader = new FileReader();
    reader.onload = e => { img.src = e.target.result; };
    reader.readAsDataURL(file);
  }

  // Hier URLs speichern für später
  window.uploadedImageURLs = await uploadFiles(files);
}

function clearPreviews() {
  previewContainer.innerHTML = '';
}