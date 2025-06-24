const { DataTypes, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.INTEGER,
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  User.associate = (models) => {
    User.hasMany(models.Cart, { foreignKey: 'user_id' });
    User.hasMany(models.Purchase, { foreignKey: 'user_id' });
  };

  return User;
};
