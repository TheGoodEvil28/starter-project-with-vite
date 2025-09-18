// index.js
import '../styles/styles.css';
import App from './view/app.js';
// VAPID key (public) dari dicoding (sediakan jika beda)
export const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';
let deferredPrompt;
const installBtn = document.getElementById('installBtn');



window.addEventListener('beforeinstallprompt', (e) => {
  // Stop Chrome dari auto-prompt
  e.preventDefault();
  deferredPrompt = e;

  // Munculkan tombol install di UI
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;

  // Tampilkan prompt
  deferredPrompt.prompt();

  // Tunggu pilihan user
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to install: ${outcome}`);

  // Reset
  deferredPrompt = null;
  installBtn.style.display = 'none';
});




// register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(() => {
    console.log('SW registered');
  }).catch((err) => {
    console.warn('SW register failed', err);
  });
}

// Skip-to-content: prevent changing hash, set focus to main
const skipLink = document.querySelector('.skip-link');
if (skipLink) {
  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
    }
  });
}

// ============================
// NAVBAR / LOGOUT FUNCTIONS
// ============================
function updateNavLinks() {
  const token = localStorage.getItem('token');
  const loginLink = document.querySelector('#login-link');
  const registerLink = document.querySelector('#register-link');
  const logoutLink = document.querySelector('#logout-link');

  if (token) {
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
    logoutLink.style.display = 'block';
  } else {
    loginLink.style.display = 'block';
    registerLink.style.display = 'block';
    logoutLink.style.display = 'none';
  }
}

function setupLogout() {
  const logoutLink = document.querySelector('#logout-link a');

  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');

    alert('Anda telah logout!');
    window.location.hash = '#/login';

    updateNavLinks();
  });
}

// ============================
// APP INITIALIZATION
// ============================
document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  updateNavLinks();   // <-- update navbar on page load
  setupLogout();      // <-- attach logout handler
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    updateNavLinks(); // <-- update navbar on route change
    await app.renderPage();
  });
});
