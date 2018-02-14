import homeController from '../controllers/homeController';
import apiController from '../controllers/apiController';
import authController from '../controllers/authController';
import helper from './routeHelper';

export default {
  init: initRoutes,
};

function initRoutes(app) {
  helper.init(app);

  initApiRoutes(helper);

  initAuthRoutes(helper);

  // all other routes are rendered as home (for client side routing)
  helper.get('*', homeController.home, {auth: false});
}

function initApiRoutes(localHelper) {
  localHelper.get('/api/current-user', apiController.currentUser);

  localHelper.get('/api/categories', apiController.categoryList);
  localHelper.post('/api/category', apiController.saveCategory);
  localHelper.delete('/api/category/:id', apiController.deleteCategory);

  localHelper.get('/api/records', apiController.recordList);
  localHelper.post('/api/record', apiController.saveRecord);
  localHelper.delete('/api/record/:id', apiController.deleteRecord);
}

function initAuthRoutes(localHelper) {
  localHelper.post('/api/sign-up', authController.signUpPost, {auth: false});
  localHelper.post('/api/login', authController.loginPost, {auth: false});
  localHelper.post('/api/password-forgot', authController.forgotPassword, {auth: false});
  localHelper.get('/api/password-reset/:token', authController.resetPassword, {auth: false});
  localHelper.post('/api/password-reset', authController.resetPasswordPost, {auth: false});
  localHelper.get('/api/activate/:token', authController.activate, {auth: false});
}
