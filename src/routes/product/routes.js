const { Router } = require('express');

module.exports = (controller) => {
  const router = Router();

  router.post('/', controller.create);
  router.get('/search', controller.search);
  router.get('/', controller.getAll);
  router.get('/:gtin', controller.getByGtin);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);
  router.post('/scan', controller.consultProduct);

  return Router().use('/products', router);
};
