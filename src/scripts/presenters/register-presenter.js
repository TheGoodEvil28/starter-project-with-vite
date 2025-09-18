import Api from '../model/api.js';

class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async handleRegister(name, email, password) {
    try {
      // panggil dari Api class
      const result = await Api.register({ name, email, password });
      this.view.showSuccess(result.message);
    } catch (err) {
      this.view.showError(err.message);
    }
  }
}

export default RegisterPresenter;
