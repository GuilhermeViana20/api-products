const formatPrice = require("../utils/formatPrice");

const productMapper = {
  map(item) {
    return {
      id: Number(item.id),
      name: item.name,
      description: item.description,
      gtin: parseInt(item.gtin) || '',
      image: item.image,
      avg_price: formatPrice(item.avg_price),
      price: formatPrice(item.price),
      barcode_image: item.barcode_image,
      created_at: item.created_at ? new Date(item.created_at).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) : '',
      updated_at: item.updated_at ? new Date(item.updated_at).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) : '',
    };
  },

  mapMany(items) {
    return items.map(item => this.map(item));
  }
};

module.exports = productMapper;