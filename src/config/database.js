const { Sequelize } = require('sequelize');
const User = require('../models/User');
const Cart = require('../models/Cart');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const CartItem = require('../models/CartItem');

async function setupDatabase() {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
  });

  const models = {
    User: User(sequelize),
    Cart: Cart(sequelize),
    Purchase: Purchase(sequelize),
    Product: Product(sequelize),
    CartItem: CartItem(sequelize),
  };

  const { User: U, Cart: C, Purchase: P, Product: Pr, CartItem: CI } = models;

  U.hasOne(C);
  C.belongsTo(U);

  U.hasMany(P);
  P.belongsTo(U);

  C.belongsToMany(Pr, { through: CI });
  Pr.belongsToMany(C, { through: CI });

  CI.belongsTo(C);
  CI.belongsTo(Pr);

  C.hasMany(CI);
  Pr.hasMany(CI);

  await sequelize.sync();
  return { sequelize, models };
}

module.exports = { setupDatabase };
