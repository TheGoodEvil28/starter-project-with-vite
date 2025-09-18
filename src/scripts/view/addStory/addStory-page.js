import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StoryPresenter from '../../presenters/story-presenter.js';

export default {
  async render() {
    return `
      <h1>Tambah Story</h1>
      <form id="addStoryForm">
        <label>Judul / Nama:</label>
        <input type="text" id="name" required>

        <label>Deskripsi:</label>
        <textarea id="description" required></textarea>

        <label>Upload Foto:</label>
        <input type="file" id="fileUpload" accept="image/*">

        <label>Foto via Kamera:</label>
        <video id="camera" autoplay playsinline width="300"></video>
        <canvas id="snapshot" style="display:none;"></canvas>
        <button type="button" id="captureBtn">Ambil Foto</button>
        <button type="button" id="toggleCameraBtn">Aktifkan Kamera</button>

        <label>
          <input type="checkbox" id="enableMap"> Tambahkan lokasi
        </label>
        <div id="mapContainer" style="height:300px; display:none;"></div>

        <button type="submit">Tambah Story</button>
      </form>
    `;
  },

  async afterRender() {
    const video = document.querySelector('#camera');
    const canvas = document.querySelector('#snapshot');
    const captureBtn = document.querySelector('#captureBtn');
    const toggleCameraBtn = document.querySelector('#toggleCameraBtn');
    const fileInput = document.querySelector('#fileUpload');

    let photoBlob, lat, lon, map, marker, stream;

    // Start / Stop Kamera
    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        stream = null;
        toggleCameraBtn.textContent = 'Aktifkan Kamera';
      }
    };

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        toggleCameraBtn.textContent = 'Matikan Kamera';
      } catch (err) {
        alert('Gagal mengakses kamera: ' + err.message);
      }
    };

    toggleCameraBtn.addEventListener('click', () => {
      if (stream) stopCamera();
      else startCamera();
    });

    // Capture foto dari kamera
    captureBtn.addEventListener('click', () => {
      if (!stream) {
        alert('Hidupkan kamera dulu!');
        return;
      }

      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      canvas.toBlob(blob => { photoBlob = blob; }, 'image/jpeg');

      stopCamera();
    });

    // Toggle peta
    const mapContainer = document.querySelector('#mapContainer');
    const enableMap = document.querySelector('#enableMap');
    enableMap.addEventListener('change', () => {
      if (enableMap.checked) {
        mapContainer.style.display = 'block';
        if (!map) {
          // Map dengan 2 tile layer
          const street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
          const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
          map = L.map('mapContainer', { layers: [street] }).setView([-6.2, 106.8], 13);
          const baseMaps = { "Street": street, "Topo": topo };
          L.control.layers(baseMaps).addTo(map);

          const layerGroup = L.layerGroup().addTo(map);

          map.on('click', e => {
            lat = e.latlng.lat;
            lon = e.latlng.lng;
            layerGroup.clearLayers();
            marker = L.marker([lat, lon]).addTo(layerGroup);
          });
        }
      } else {
        mapContainer.style.display = 'none';
        if (marker) marker.remove();
        lat = lon = undefined;
      }
    });

    // Submit form
    const view = {
      showSuccess: (msg) => {
        alert(msg);
        window.location.hash = '#/';
      },
      showError: (msg) => alert(`Gagal menambahkan story: ${msg}`)
    };
    const presenter = new StoryPresenter(view);

    document.querySelector('#addStoryForm').addEventListener('submit', async e => {
      e.preventDefault();

      // Cek foto, prioritaskan upload file > kamera
      if (fileInput.files[0]) photoBlob = fileInput.files[0];
      if (!photoBlob) {
        alert('Silakan ambil foto atau upload file terlebih dahulu');
        return;
      }

      const description = document.querySelector('#description').value;

      await presenter.addStory({ description, photo: photoBlob, lat, lon });

      stopCamera();
    });

    // Stop kamera saat pindah halaman atau unload
    window.addEventListener('hashchange', stopCamera);
    window.addEventListener('beforeunload', stopCamera);
  }
};
