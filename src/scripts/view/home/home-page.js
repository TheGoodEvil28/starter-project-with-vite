// Tambahkan ini di paling atas file
// import StoryPresenter from '../../presenters/story-presenter.js'; // sesuaikan path
import StoryPresenter from '@/scripts/presenters/story-presenter.js';

export default {
  async render() {
    return `
      <h1>Daftar Story</h1>
      <div id="storyList">Loading...</div>
    `;
  },

  async afterRender() {
    const view = {
      showStories: (stories) => {
        document.querySelector('#storyList').innerHTML = stories.map(story => `
          <article style="margin:1rem; padding:1rem; background:white; border-radius:8px;">
            <img src="${story.photoUrl}" alt="${story.name}" width="150" style="border-radius:4px;">
            <h2>${story.name}</h2>
            <p>${story.description}</p>
            <p><strong>Created at:</strong> ${new Date(story.createdAt).toLocaleString()}</p>
            ${story.lat && story.lon ? `<p><strong>Location:</strong> ${story.lat}, ${story.lon}</p>` : ''}
          </article>
        `).join('');
      },
      showError: (msg) => {
        document.querySelector('#storyList').innerHTML = `Gagal memuat data: ${msg}`;
      }
    };

    const presenter = new StoryPresenter(view);
    presenter.loadStories();
  }
};
