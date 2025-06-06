const express = require('express');

module.exports = async (models) => {
  const router = express.Router();

  // Repositórios
  const userRepo = require('../repositories/UserRepository')(models.User);
  const cartRepo = require('../repositories/CartRepository')(models.Cart);
  const purchaseRepo = require('../repositories/PurchaseRepository')(models.Purchase);
  const productRepo = require('../repositories/ProductRepository')(models.Product);

  // Serviços
  const userService = require('../services/UserService')(userRepo, cartRepo);
  const cartService = require('../services/CartService')(cartRepo);
  const purchaseService = require('../services/PurchaseService')(purchaseRepo);
  const productService = require('../services/ProductService')(productRepo);

  // Controllers (defina antes de usar!)
  const userController = require('../controllers/UserController')(userService);
  const cartController = require('../controllers/CartController')(cartService);
  const purchaseController = require('../controllers/PurchaseController')(purchaseService);
  const productController = require('../controllers/ProductController')(productService);

  // Rotas (somente agora use os controllers)
  router.use(require('./user/routes')(userController));
  router.use(require('./cart/routes')(cartController));
  router.use(require('./purchase/routes')(purchaseController));
  router.use(require('./product/routes')(productController));

  return router;
};
