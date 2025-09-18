import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapPresenter from '../../presenters/map-presenter.js';

// Override default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default {
  async render() {
    return `<section class="map-container" id="map" style="height:500px;"></section>`;
  },

  async afterRender() {
    // Tile layers
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' });
    const satellite = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenTopoMap' });

    // Inisialisasi map
    const map = L.map('map', { layers: [osm] }).setView([-6.2088, 106.8456], 13);
    L.control.layers({ "OpenStreetMap": osm, "Satellite": satellite }).addTo(map);

    const view = {
      showMarkers: (stories) => {
        stories.forEach(story => {
          const lat = story.lat || -6.2088;
          const lon = story.lon || 106.8456;

          const marker = L.marker([lat, lon], {
            title: story.name,
            alt: story.description
          }).addTo(map);

          const photo = story.photoUrl || 'https://via.placeholder.com/100';
          marker.bindPopup(`
            <h3>${story.name}</h3>
            <p>${story.description}</p>
            <img src="${photo}" alt="${story.name}" width="100">
          `);
        });
      },
      showError: (msg) => alert(`Gagal memuat peta: ${msg}`)
    };

    const presenter = new MapPresenter(view);
    try {
      await presenter.loadMapStories();
    } catch (err) {
      view.showError(err.message);
    }
  }
};
