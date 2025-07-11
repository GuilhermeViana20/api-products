// File: src/routes/product/routes.js
const auth = require('../../middlewares/authMiddleware');

module.exports = (controller) => {
  const router = require('express').Router();

  router.use(auth);

  router.get('/', controller.index);
  router.post('/', controller.store);
  router.get('/:gtin', controller.show);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.destroy);
  router.post('/search', controller.search);
  router.post('/scan', controller.scan);

  return router;
};
