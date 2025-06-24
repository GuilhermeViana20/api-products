const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Purchase = sequelize.define('Purchase', {
    total: DataTypes.FLOAT,
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Purchase.associate = (models) => {
    Purchase.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Purchase;
};
