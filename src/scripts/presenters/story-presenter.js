import Api from '../model/api.js';
import { getStoriesFromDB } from '../utils/indexeddb.js';

class StoryPresenter {
  constructor(view) {
    this.view = view;
    this.stories = [];
  }

  async loadStories() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Silakan login dulu');

      const stories = await Api.getStories(token);
      this.stories = stories;            // hanya simpan di memori
      this.view.showStories(stories);    // render ke UI
    } catch (err) {
      // fallback offline
      const offline = await getStoriesFromDB();
      if (offline?.length) {
        this.stories = offline;
        this.view.showStories(offline);
      } else {
        this.view.showError(err.message);
      }
    }
  }

  async addStory({ description, photo, lat, lon }) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Silakan login dulu');
      const res = await Api.addStory({ token, description, photo, lat, lon });
      this.view.showSuccess(res.message || 'Berhasil menambah story');
    } catch (err) {
      this.view.showError(err.message);
    }
  }
}

export default StoryPresenter;
