import Api from '../model/api.js';

class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleLogin(email, password) {
    try {
      const result = await Api.login({ email, password });

      localStorage.setItem('token', result.token);
      localStorage.setItem('userId', result.userId);
      localStorage.setItem('name', result.name);

      this.view.showSuccess(`Selamat datang, ${result.name}`);
    } catch (err) {
      this.view.showError(err.message);
    }
  }
}

export default LoginPresenter;
