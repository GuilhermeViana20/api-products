const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cart = sequelize.define('Cart', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: 'user_id' });
    Cart.hasMany(models.CartItem, { foreignKey: 'cart_id' });
  };

  return Cart;
};
