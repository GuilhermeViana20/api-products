const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

const db = {
  sequelize,
  Sequelize,
  User: require('./User')(sequelize),
  Cart: require('./Cart')(sequelize),
  Product: require('./Product')(sequelize),
  Purchase: require('./Purchase')(sequelize),
  CartItem: require('./CartItem')(sequelize),
};

// Chama associate() de todos os models
Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

module.exports = db;
