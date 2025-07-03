// routes.index.js
const express = require('express');
const { setupSheets } = require('../config/database');

module.exports = async (models) => {
  const router = express.Router();
  const { sheets, spreadsheetId } = await setupSheets();

  // Repositórios
  const userRepo = require('../repositories/UserRepository')(sheets, spreadsheetId);
  const productRepo = require('../repositories/ProductRepository')(sheets, spreadsheetId);
  const cartRepo = require('../repositories/CartRepository')(sheets, spreadsheetId, userRepo);
  const cartItemRepo = require('../repositories/CartItemRepository')(sheets, spreadsheetId, productRepo)
  const purchaseRepo = require('../repositories/PurchaseRepository')(models.Purchase);

  // Serviços
  const userService = require('../services/UserService')(userRepo, cartRepo);
  const productService = require('../services/ProductService')(productRepo);
  const cartService = require('../services/CartService')(cartRepo, cartItemRepo, productRepo);
  const purchaseService = require('../services/PurchaseService')(purchaseRepo);

  // Controllers (defina antes de usar!)
  const userController = require('../controllers/UserController')(userService);
  const productController = require('../controllers/ProductController')(productService);
  const cartController = require('../controllers/CartController')(cartService);
  const purchaseController = require('../controllers/PurchaseController')(purchaseService);

  // Rotas (somente agora use os controllers)
  router.use(require('./user/routes')(userController, cartController));
  router.use(require('./product/routes')(productController));
  router.use(require('./cart/routes')(cartController));
  router.use(require('./purchase/routes')(purchaseController));

  return router;
};
