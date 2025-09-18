import StoryPresenter from '@/scripts/presenters/story-presenter.js';
import { saveStory, getStoriesFromDB } from '@/scripts/utils/indexeddb.js';

export default {
  async render() {
    return `
      <h1>Daftar Story</h1>
      <div id="storyList">Loading...</div>
    `;
  },

  async afterRender() {
    const container = document.querySelector('#storyList');

    const view = {
      showStories: (stories) => {
        container.innerHTML = stories.map(story => `
          <article style="margin:1rem; padding:1rem; background:white; border-radius:8px;">
            <img src="${story.photoUrl}" alt="${story.name}" width="150" style="border-radius:4px;">
            <h2>${story.name}</h2>
            <p>${story.description}</p>
            <button class="bookmark-btn" data-id="${story.id}">🔖 Simpan</button>
            <p><strong>Created at:</strong> ${new Date(story.createdAt).toLocaleString()}</p>
            ${story.lat && story.lon ? `<p><strong>Location:</strong> ${story.lat}, ${story.lon}</p>` : ''}
          </article>
        `).join('');
      },
      showError: (msg) => {
        container.innerHTML = `Gagal memuat data: ${msg}`;
      }
    };

    const presenter = new StoryPresenter(view);
    await presenter.loadStories();

    // ✅ event delegation hanya pada container, bukan document
    container.addEventListener('click', async (e) => {
      if (e.target.classList.contains('bookmark-btn')) {
        const id = e.target.dataset.id;
        const story = presenter.stories.find(s => s.id === id);

        // ✅ cek dulu apakah sudah tersimpan
        const saved = await getStoriesFromDB();
        if (saved.some(s => s.id === story.id)) {
          alert('Story sudah ada di koleksi!');
          return;
        }

        await saveStory(story);
        alert('Story disimpan ke koleksi!');
      }
    });
  }
};
