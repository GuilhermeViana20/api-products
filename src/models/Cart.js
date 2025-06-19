const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Cart', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};
