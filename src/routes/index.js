// routes.index.js
const express = require('express');
const { setupSheets } = require('../config/database');

module.exports = async () => {
  const router = express.Router();
  const { sheets, spreadsheetId } = await setupSheets();

  // Repositórios
  const userRepo = require('../repositories/UserRepository')(sheets, spreadsheetId);
  const productRepo = require('../repositories/ProductRepository')(sheets, spreadsheetId);
  const cartRepo = require('../repositories/CartRepository')(sheets, spreadsheetId, userRepo);
  const cartItemRepo = require('../repositories/CartItemRepository')(sheets, spreadsheetId, productRepo)

  // Serviços
  const userService = require('../services/UserService')(userRepo, cartRepo);
  const productService = require('../services/ProductService')(productRepo);
  const cartService = require('../services/CartService')(cartRepo, cartItemRepo, productRepo);

  // Controllers (defina antes de usar!)
  const userController = require('../controllers/UserController')(userService);
  const productController = require('../controllers/ProductController')(productService);
  const cartController = require('../controllers/CartController')(cartService);

  // Rotas (somente agora use os controllers)
  router.use('/users', require('./user/routes')(userController, cartController));
  router.use('/products', require('./product/routes')(productController));
  router.use('/carts', require('./cart/routes')(cartController));

  return router;
};
