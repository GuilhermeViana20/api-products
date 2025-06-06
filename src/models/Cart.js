const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Cart', {
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
};
