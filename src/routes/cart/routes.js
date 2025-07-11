// File: src/routes/cart/routes.js
const auth = require('../../middlewares/authMiddleware');

module.exports = (controller) => {
  const router = require('express').Router();

  router.use(auth);
  // rotas do carrinho...

  return router;
};
