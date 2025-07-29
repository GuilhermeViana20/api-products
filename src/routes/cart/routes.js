// File: src/routes/cart/routes.js
const auth = require('../../middlewares/authMiddleware');

module.exports = (controller) => {
  const router = require('express').Router();

  router.use(auth);

  // rotas do carrinho...
  router.get('/', controller.index);
  router.get('/:cart_id', controller.show);
  router.post('/', controller.store);
  router.post('/active', controller.active);
  router.post('/items', controller.addToCart);
  router.delete('/items', controller.removeToCart);
  router.get('/:cart_id/pdf', controller.generatePdf);
  router.put('/:cart_id/items/:product_id', controller.update);

  return router;
};
