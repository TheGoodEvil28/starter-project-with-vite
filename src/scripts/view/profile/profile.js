import { subscribeNotifications, unsubscribeNotifications } from '../../model/api.js';
import { VAPID_PUBLIC_KEY } from '../../index.js'; // pastikan export dari index.js

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) output[i] = raw.charCodeAt(i);
  return output;
}

export default {
  async render() {
    const name = localStorage.getItem('name') || '-';
    return `
      <main>
        <h1>Profil</h1>
        <p><strong>Nama:</strong> ${name}</p>
        <button id="logoutBtn">Logout</button>
        <div>
          <button id="pushToggleBtn">Enable Notifications</button>
        </div>
      </main>
    `;
  },
  async afterRender() {
    document.querySelector('#logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token'); localStorage.removeItem('name'); localStorage.removeItem('userId');
      alert('Logout sukses');
      window.location.hash = '#/login';
    });

    const pushBtn = document.querySelector('#pushToggleBtn');
    const token = localStorage.getItem('token');
   // index.js atau main entry
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.error('SW registration failed:', err));
  }


    // check subscription
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) pushBtn.textContent = 'Disable Notifications';

    pushBtn.addEventListener('click', async () => {
      if (!token) { alert('Silakan login dulu'); window.location.hash = '#/login'; return; }
      const reg = await navigator.serviceWorker.ready;
      const curSub = await reg.pushManager.getSubscription();
      if (curSub) {
        // unsubscribe on server and client
        await unsubscribeNotifications(token, { endpoint: curSub.endpoint });
        await curSub.unsubscribe();
        pushBtn.textContent = 'Enable Notifications';
        alert('Unsubscribed');
      } else {
        // subscribe
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
        await subscribeNotifications(token, {
          endpoint: sub.endpoint,
          keys: sub.toJSON().keys
        });
        pushBtn.textContent = 'Disable Notifications';
        alert('Subscribed to push notification');
      }
    });
  }
};
