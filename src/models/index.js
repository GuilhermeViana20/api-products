const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

// Importa os models
const User = require('./User')(sequelize);
const Cart = require('./Cart')(sequelize);
const Product = require('./Product')(sequelize);
const Purchase = require('./Purchase')(sequelize);
const CartItem = require('./CartItem')(sequelize);

// Define os relacionamentos
User.hasMany(Cart, { foreignKey: 'user_id', as: 'carts' });
Cart.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id', as: 'cart' });

Product.hasMany(CartItem, { foreignKey: 'product_id', as: 'cart_items' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Exporta tudo em um objeto `db`
const db = {
  sequelize,
  Sequelize,
  User,
  Cart,
  Product,
  Purchase,
  CartItem,
};

module.exports = db;
