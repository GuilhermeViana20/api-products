// src/services/ProductService.js
const ProductLookupService = require('../services/ProductLookupService');
const getLocalDateTime = require('../utils/getLocalDateTime');
const now = getLocalDateTime();

module.exports = (productRepository) => ({
  async index() {
    return await productRepository.index();
  },

  async store(data) {
    if (!data.gtin) throw new Error('GTIN não informado');

    const exists = await productRepository.show(data.gtin);
    if (exists) throw new Error('Produto já existe');

    const cosmosData = await ProductLookupService.getProductByBarcode(data.gtin);
    if (!cosmosData) throw new Error('Produto não encontrado na API externa');

    const productData = {
      name: cosmosData.description || '',
      description: cosmosData.description || '',
      gtin: cosmosData.gtin.toString(),
      image: cosmosData.thumbnail || 'https://i.ibb.co/fYw4g7L/no-image.jpg',
      barcode_image: cosmosData.barcode_image || '',
      price: data.price || '0.00',
      avg_price: data.avg_price || '0.00',
      created_at: now,
      updated_at: now
    };

    return await productRepository.store(productData);
  },

  async show(gtin) {
    return await productRepository.show(gtin);
  },

  async update(id, data) {
    const products = await productRepository.index();
    const productIndex = products.findIndex(p => p.id === Number(id));
    if (productIndex === -1) throw new Error('Produto não encontrado');

    const product = products[productIndex];

    const updatedProduct = {
      ...product,
      ...data,
      updated_at: getLocalDateTime(),
    };

    await productRepository.update(Number(id), updatedProduct);

    return {
      ...updatedProduct,
      id: Number(id),
    };
  },

  async destroy(id) {
    const products = await productRepository.index();
    const productExists = products.some(p => Number(p.id) === Number(id));
    if (!productExists) throw new Error('Produto não encontrado');

    await productRepository.destroy(id);
  },

  async search(query) {
    if (!query) return [];

    const products = await productRepository.index();
    const qLower = query.toLowerCase();

    const results = products.filter(p =>
      (p.gtin && p.gtin.toString().includes(query)) ||
      (p.name && p.name.toLowerCase().includes(qLower))
    );

    return results;
  },

  async scan(gtin) {
    if (!gtin) throw new Error('GTIN não informado');

    const existingProduct = await productRepository.show(gtin);
    if (existingProduct) return existingProduct;

    const cosmosData = await ProductLookupService.getProductByBarcode(gtin);
    if (!cosmosData) throw new Error('Produto não encontrado na API externa');

    const productData = {
      name: cosmosData.description || '',
      description: cosmosData.description || '',
      gtin: cosmosData.gtin.toString(),
      image: cosmosData.thumbnail || 'https://i.ibb.co/fYw4g7L/no-image.jpg',
      barcode_image: cosmosData.barcode_image || '',
      price: '0.00',
      avg_price: '0.00',
    };

    return await productRepository.store(productData);
  }
});
