import Api from '../model/api.js';

class MapPresenter {
  constructor(view) {
    this.view = view;
  }

  async loadMapStories() {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Silakan login dulu');

      const stories = await Api.getStories(token);
      this.view.showMarkers(stories);
    } catch (err) {
      this.view.showError(err.message);
    }
  }
}

export default MapPresenter;
