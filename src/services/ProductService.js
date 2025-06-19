// services/ProductService.js
const { getProductByBarcode } = require('./ProductLookupService');
const productMapper = require('../mappers/productMapper');

module.exports = (productRepository) => ({
  createProduct: async (barcode, price = null) => {
    const existing = await productRepository.find(barcode);
    if (existing) throw new Error('Produto já existe');

    const externalData = await getProductByBarcode(barcode);
    if (!externalData) throw new Error('Produto não encontrado na API externa');

    const productData = productMapper(externalData, price);
    return productRepository.create(productData);
  },

  getProduct: async (gtin) => {
    const product = await productRepository.find(gtin);
    if (!product) throw new Error('Produto não encontrado');

    return product;
  },

  getAllProducts: async () => {
    const products = await productRepository.findAll();
    const productData = productMapper(products);
    return productData;
  },

  updateProduct: async (id, data) => {
    const product = await productRepository.findById(id);
    if (!product) throw new Error('Produto não existe');

    await productRepository.update(id, data);

    const updatedProduct = await productRepository.findById(id);
    return updatedProduct;
  },

  deleteProduct: async (id) => {
    const product = await productRepository.findById(id);
    if (!product) throw new Error('Produto não existe');

    productRepository.delete(id)
  }
});