import homePage from '../view/home/home-page.js';
import mapPage from '../view/map/map-page.js';
import addStoryPage from '../view/addStory/addStory-page.js';
import aboutPage from '../view/about/about-page.js';
import loginPage from '../view/login/login-page.js';
// import loginPage from '../pages/register/register-page.js';
import registerPage from '../view/register/register-page.js';
import profilePage from '../view/profile/profile.js';


const routes = {
  '/': homePage,
  '/home': homePage,
  '/map': mapPage,
  '/add': addStoryPage,
  '/about': aboutPage,
  '/login': loginPage,
  '/register': registerPage,
  '/profile': profilePage


};

export default routes;
