const API_URL = 'https://mendric.vercel.app/api/chronik';
const VERIFY_URL = 'https://mendric.vercel.app/api/verify-password';
let entries = [];
let currentPage = 0;

const openSound = new Audio('https://cdn.freesound.org/previews/704/704359_634166-lq.mp3');

async function loadEntries() {
  const res = await fetch(API_URL);
  entries = await res.json();
  renderPage(currentPage);
  renderTOC();
}

function checkAccess() {
  const input = document.getElementById('accessPassword').value.trim();
  fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: input })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById('cover').style.display = 'none';
        document.getElementById('chronikApp').style.display = 'block';
        openSound.play();
        loadEntries();
      } else {
        alert('⚡ Du erhältst einen Elektrischen Schock und erhälst 1W6 Schaden');
        location.reload();
      }
    })
    .catch(() => {
      alert('⚡ Du erhältst einen Elektrischen Schock und erhälst 1W6 Schaden');
      location.reload();
    });
}

window.checkAccess = checkAccess;