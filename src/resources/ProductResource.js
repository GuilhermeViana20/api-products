const formatPrice = require('../utils/formatPrice');

const ProductResource = {
  toResponse: (product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    image: product.image,
    gtin: product.gtin,
    price: formatPrice(product.price),
    avg_price: formatPrice(product.avg_price),
    barcode_image: product.barcode_image
  }),

  collection: (products) => products.map(ProductResource.toResponse),
};

module.exports = ProductResource;