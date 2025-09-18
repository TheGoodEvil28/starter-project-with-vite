import routes from '../routes/routes.js';
import { getActiveRoute } from '../routes/url-parser.js';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ content, drawerButton, navigationDrawer }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });
  }

  async renderPage() {
  const route = getActiveRoute();
  const page = routes[route] || routes['/'];

  const token = localStorage.getItem('token');
  if (!token && route !== '/login' && route !== '/register') {
    window.location.hash = '#/login';
    return;
  }

  // === View Transition API ===
  if (document.startViewTransition) {
    document.startViewTransition(async () => {
      this.#content.innerHTML = await page.render();
      if (typeof page.afterRender === 'function') {
        await page.afterRender();
      }
    });
  } else {
    // fallback untuk browser lama
    this.#content.innerHTML = await page.render();
    if (typeof page.afterRender === 'function') {
      await page.afterRender();
    }
  }

  // fokus ke konten utama (aksesibilitas)
  this.#content.setAttribute('tabindex', '-1');
  this.#content.focus();
}




}

export default App;
