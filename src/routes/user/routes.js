// routes/user/routes.js
const { Router } = require('express');

module.exports = (controller, cartController) => {
  const router = Router();

  router.get('/', controller.index);
  router.post('/', controller.store);
  router.get('/:id', controller.show);
  router.put('/:id', controller.update);
  
  router.post('/:id/cart', cartController.createCart);
  router.post('/:id/cart/items', cartController.addItemToCart);
  router.get('/:id/cart/:cartId', cartController.getCart);
  router.get('/:id/carts', cartController.listCarts);
  router.put('/:id/cart/items', cartController.updateCartItem);

  return Router().use('/users', router);
};
