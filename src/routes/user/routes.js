const { Router } = require('express');

module.exports = (controller) => {
  const router = Router();

  router.get('/', controller.index);
  router.post('/', controller.store);
  router.get('/:id', controller.show);
  router.put('/:id', controller.update);
  // router.delete('/:id', controller.delete);

  return Router().use('/users', router);
};
