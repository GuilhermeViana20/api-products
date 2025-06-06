module.exports = (productRepository) => ({
  createProduct: (data) => productRepository.create(data),

  getProductById: (id) => productRepository.findById(id),

  getAllProducts: () => productRepository.findAll(),

  updateProduct: (id, data) => productRepository.update(id, data),

  deleteProduct: (id) => productRepository.delete(id),
});
