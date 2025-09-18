// import LoginPresenter from '../../presenters/login-presenter.js';
import LoginPresenter from '@/scripts/presenters/login-presenter.js';

export default {
  async render() {
    return `
      <section class="form-section">
        <h1>Login</h1>
        <form id="loginForm">
          <div>
            <label for="email">Email:</label>
            <input id="email" type="email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input id="password" type="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>Belum punya akun? <a href="#/register">Register</a></p>
      </section>
    `;
  },

  async afterRender() {
    const form = document.querySelector('#loginForm');
    const presenter = new LoginPresenter(this);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.querySelector('#email').value;
      const password = form.querySelector('#password').value;
      await presenter.handleLogin(email, password);
    });
  },

  showSuccess(message) {
    alert(message || 'Login berhasil!');
    window.location.hash = '#/';
    // Update header
    const logoutLink = document.querySelector('#logout-link');
    const loginLink = document.querySelector('#login-link');
    const registerLink = document.querySelector('#register-link');

    logoutLink.style.display = 'block';
    loginLink.style.display = 'none';
    registerLink.style.display = 'none';
  },

  showError(message) {
    alert(`Login gagal: ${message}`);
  }
};
