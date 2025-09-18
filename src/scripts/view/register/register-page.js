// import RegisterPresenter from '../../presenters/register-presenter.js';
import RegisterPresenter from '@/scripts/presenters/register-presenter.js';


export default {
  async render() {
    return `
      <section class="form-section">
        <h1>Register</h1>
        <form id="registerForm">
          <div>
            <label for="name">Nama:</label>
            <input id="name" type="text" required />
          </div>
          <div>
            <label for="email">Email:</label>
            <input id="email" type="email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input id="password" type="password" required />
          </div>
          <button type="submit">Register</button>
        </form>
        <p>Sudah punya akun? <a href="#/login">Login</a></p>
      </section>
    `;
  },

  async afterRender() {
    const form = document.querySelector('#registerForm');
    const presenter = new RegisterPresenter(this);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.querySelector('#name').value;
      const email = form.querySelector('#email').value;
      const password = form.querySelector('#password').value;
      await presenter.handleRegister(name, email, password);
    });
  },

  showSuccess(message) {
    alert(message || 'Register berhasil!');
    window.location.hash = '#/login';
  },

  showError(message) {
    alert(`Register gagal: ${message}`);
  }
};
