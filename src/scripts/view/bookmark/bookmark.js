// import { getStoriesFromDB, deleteStoryFromDB } from '../utils/indexeddb.js';
import { getStoriesFromDB, deleteStoryFromDB } from '@/scripts/utils/indexeddb.js';


export default {
  async render() {
    return `
      <h1>Koleksi Story Tersimpan</h1>
      <div id="bookmarkList">Loading...</div>
    `;
  },

  async afterRender() {
    const container = document.querySelector('#bookmarkList');
    const stories = await getStoriesFromDB();

    if (!stories.length) {
      container.innerHTML = '<p>Belum ada story tersimpan</p>';
      return;
    }

    container.innerHTML = stories.map(story => `
      <article style="margin:1rem; padding:1rem; background:white; border-radius:8px;">
        <img src="${story.photoUrl}" alt="${story.name}" width="150" style="border-radius:4px;">
        <h2>${story.name}</h2>
        <p>${story.description}</p>
        <button class="delete-btn" data-id="${story.id}">❌ Hapus</button>
      </article>
    `).join('');

    container.addEventListener('click', async (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const id = e.target.dataset.id;
        await deleteStoryFromDB(id);
        e.target.closest('article').remove();
      }
    });
  }
};
