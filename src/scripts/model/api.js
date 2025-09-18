const BASE_URL = 'https://story-api.dicoding.dev/v1';

async function handleRes(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.error) {
    const msg = data.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// AUTH
export async function register({ name, email, password }) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleRes(res);
}

export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleRes(res);
  return data.loginResult; // { userId, name, token }
}

// STORIES
export async function getStories(token) {
  const res = await fetch(`${BASE_URL}/stories?location=1`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await handleRes(res);
  return data.listStory || [];
}

export async function addStory({ token, description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  if (lat) formData.append('lat', lat);
  if (lon) formData.append('lon', lon);

  const res = await fetch(`${BASE_URL}/stories`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return handleRes(res);
}

// Push subscribe/unsubscribe
export async function subscribeNotifications(token, subscription) {
  const res = await fetch(`${BASE_URL}/notifications/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(subscription)
  });
  return handleRes(res);
}

export async function unsubscribeNotifications(token, subscription) {
  const res = await fetch(`${BASE_URL}/notifications/subscribe`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(subscription)
  });
  return handleRes(res);
}

export default {
  register,
  login,
  getStories,
  addStory,
  subscribeNotifications,
  unsubscribeNotifications,
};

