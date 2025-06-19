const { getProductByBarcode } = require('./ProductLookupService');

module.exports = (productRepository) => ({
  createProduct: async (barcode, price = null) => {
    const existing = await productRepository.find(barcode);
    if (existing) throw new Error('Produto já existe');

    const externalData = await getProductByBarcode(barcode);
    if (!externalData) throw new Error('Produto não encontrado na API externa');

    try {
      return productRepository.create({
        name: externalData.description,
        description: externalData.description,
        gtin: externalData.gtin.toString(),
        image: externalData.thumbnail,
        avg_price: externalData.avg_price ?? '0.00',
        price: (price || externalData.avg_price) ?? '0.00',
        barcode_image: externalData.barcode_image,
      });
    } catch (err) {
      throw err;
    }

  },

  getProduct: (gtin) => productRepository.find(gtin),

  getAllProducts: () => productRepository.findAll(),

  updateProduct: async (id, data) => {
    const product = await productRepository.findById(id);
    if (!product) throw new Error('Produto não existe');

    await productRepository.update(id, data);

    const updatedProduct = await productRepository.findById(id);
    return updatedProduct;
  },

  deleteProduct: (id) => productRepository.delete(id),
});