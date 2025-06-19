const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('CartItem', {
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
  });
};
