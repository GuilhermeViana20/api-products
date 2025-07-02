const formatPrice = require('../utils/formatPrice');
const formatDate = require('../utils/formatDate');

const productResource = {
  toJSON(item) {
    return {
      id: Number(item.id),
      name: item.name,
      description: item.description,
      gtin: parseInt(item.gtin) || '',
      image: item.image,
      avg_price: formatPrice(item.avg_price),
      price: formatPrice(item.price),
      barcode_image: item.barcode_image,
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at),
    };
  },

  collection(items, page = 1, perPage = 10) {
    const total = items.length;
    const paginatedItems = items.slice((page - 1) * perPage, page * perPage);

    return {
      message: 'Produtos retornados com sucesso!',
      products: paginatedItems.map(this.toJSON),
      meta: {
        total,
        per_page: perPage,
        current_page: page,
        last_page: Math.ceil(total / perPage),
      }
    };
  },

  single(item) {
    return {
      message: 'Produto retornado com sucesso!',
      product: this.toJSON(item),
    };
  }
};

module.exports = productResource;