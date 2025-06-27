// services/ProductService.js
const { getProductByBarcode } = require('./ProductLookupService');
const ProductResource = require("../resources/ProductResource");
const { productMapper } = require('../mappers/productMapper');

module.exports = (productRepository) => {
  const service = {
    createProduct: async (barcode, price = null) => {
      const existing = await productRepository.find(barcode);
      if (existing) throw new Error('Produto já existe');

      const externalData = await service.consultProduct(barcode);

      const productData = productMapper(externalData, price);
      return productRepository.create(productData);
    },

    scan: async (barcode) => {
      const existing = await productRepository.find(barcode);
      if (existing) return ProductResource.toResponse(existing);

      const externalProduct = await service.consultProduct(barcode);
      return externalProduct;
    },

    searchProducts: async (query) => {
      const products = await productRepository.search(query);
      return ProductResource.collection(products);
    },

    consultProduct: async (barcode) => {
      const externalData = await getProductByBarcode(barcode);
      if (!externalData) throw new Error('Produto não encontrado na API externa');
      return ProductResource.toResponse(productMapper(externalData));
    },

    getProduct: async (gtin) => {
      const product = await productRepository.find(gtin);
      if (!product) throw new Error('Produto não encontrado');
      return product;
    },

    getAllProducts: async () => {
      const products = await productRepository.findAll();
      return ProductResource.collection(products);
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
  };

  return service;
};