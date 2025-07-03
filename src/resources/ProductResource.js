const formatPrice = require('../utils/formatPrice');
const formatDate = require('../utils/formatDate');

const productResource = {
  toJSON(product) {
    return {
      id: Number(product.id),
      name: product.name,
      description: product.description,
      gtin: parseInt(product.gtin) || '',
      image: product.image,
      avg_price: formatPrice(product.avg_price),
      price: formatPrice(product.price),
      barcode_image: product.barcode_image,
      created_at: formatDate(product.created_at),
      updated_at: formatDate(product.updated_at),
    };
  },

  collection(products, currentPage = 1, perPage = 10, total = 0) {
    return {
      message: 'Produtos retornados com sucesso!',
      products: products.map(this.toJSON),
      meta: {
        total,
        per_page: perPage,
        current_page: currentPage,
        last_page: Math.ceil(total / perPage),
      }
    };
  },

  single(product) {
    return {
      message: 'Produto retornado com sucesso!',
      product: this.toJSON(product),
    };
  }
};

module.exports = productResource;