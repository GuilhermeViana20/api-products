// src/routes/user/routes.js
const { Router } = require('express');

module.exports = (controller, cartController, services = {}) => {
  const router = Router();

  router.use((req, res, next) => {
    req.services = services;
    next();
  });

  router.post('/', controller.create);
  router.get('/:id', controller.show);
  router.put('/:id', controller.update);

  router.get('/:user_id/carts', cartController.index);
  router.get('/:user_id/cart/:cart_id', cartController.show);
  router.post('/:user_id/cart', cartController.store);
  router.post('/:id/cart/active', cartController.active);
  router.post('/:id/cart/items', cartController.addToCart);

  // router.post('/:id/cart/items', cartController.addItemToCart);
  // router.put('/:id/cart/items', cartController.updateCartItem);

  return Router().use('/users', router);
};
