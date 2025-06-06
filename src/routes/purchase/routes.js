const { Router } = require('express');

module.exports = (controller) => {
  const router = Router();

  router.get('/', controller.listPurchases);
  router.post('/', controller.createPurchase);
  // outras rotas...

  return Router().use('/purchases', router);
};
