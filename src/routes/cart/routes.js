const { Router } = require('express');

module.exports = (controller) => {
  const router = Router();
  // outras rotas...

  return Router().use('/carts', router);
};
