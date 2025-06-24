const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gtin: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avg_price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    barcode_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Product.associate = (models) => {
    Product.hasMany(models.CartItem, { foreignKey: 'product_id' });
  };

  return Product;
};
