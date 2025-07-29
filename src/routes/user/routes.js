// src/routes/user/routes.js
const { Router } = require('express');
const auth = require('../../middlewares/authMiddleware');

module.exports = (controller, cartController, services = {}) => {
  const router = Router();

  router.use((req, res, next) => {
    req.services = services;
    next();
  });

  // rotas públicas
  router.post('/login', controller.login);
  router.post('/register', controller.register);
  router.get('/confirm-email/:token', controller.confirmEmail);

  // rotas protegidas
  router.use(auth);

  router.put('/:id', controller.update);

  // router.get('/:user_id/carts', cartController.index);
  // router.get('/:user_id/cart/:cart_id', cartController.show);
  // router.post('/:user_id/cart', cartController.store);
  // router.post('/:user_id/cart/active', cartController.active);
  router.put('/:user_id/cart/:cart_id/items/:product_id', cartController.update);
  router.post('/:user_id/cart/items', cartController.addToCart);

  return router;
};
