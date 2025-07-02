const { Router } = require('express');

module.exports = (controller) => {
  const router = Router();

  router.get('/', controller.index);
  router.post('/', controller.store);
  router.get('/:gtin', controller.show);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.destroy);
  router.post('/search', controller.search);
  router.post('/scan', controller.scan);

  return Router().use('/products', router);
};
