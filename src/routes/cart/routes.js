const { Router } = require('express');

module.exports = (controller) => {
  const router = Router();

  router.get('/', controller.getActiveCart);
  // outras rotas...

  return Router().use('/carts', router);
};
