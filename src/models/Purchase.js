const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Purchase', {
    total: DataTypes.FLOAT,
  });
};
