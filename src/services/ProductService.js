const { getProductByBarcode } = require('./ProductLookupService');

module.exports = (productRepository) => ({
  createProduct: async (barcode, price = null) => {
    const existing = await productRepository.findByBarcode(barcode);
    if (existing) throw new Error('Produto já existe');

    const externalData = await getProductByBarcode(barcode);
    if (!externalData) throw new Error('Produto não encontrado na API externa');

    try {
      return productRepository.create({
        name: externalData.description,
        description: externalData.description,
        gtin: externalData.gtin.toString(),
        image: externalData.thumbnail,
        avg_price: externalData.avg_price,
        price: price || externalData.avg_price,
        barcode_image: externalData.barcode_image,
      });
    } catch (err) {
      throw err;
    }

  },

  getProductById: (id) => productRepository.findById(id),

  getAllProducts: () => productRepository.findAll(),

  updateProduct: (id, data) => productRepository.update(id, data),

  deleteProduct: (id) => productRepository.delete(id),
});