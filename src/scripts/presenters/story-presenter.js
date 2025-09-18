import Api from '../model/api.js';
import { saveStories, getStoriesFromDB } from '../utils/indexeddb.js';

class StoryPresenter {
  constructor(view) { this.view = view; }

  async loadStories() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Silakan login dulu');
      const stories = await Api.getStories(token);
      // simpan ke indexedDB untuk offline
      saveStories(stories).catch(()=>{});
      this.view.showStories(stories);
    } catch (err) {
      // fallback ke indexedDB
      const offline = await getStoriesFromDB();
      if (offline && offline.length) {
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
