// services/CartService.js
module.exports = (cartRepository) => ({
  async getActiveCartByUserId(userId) {
    return await cartRepository.findActiveByUserId(userId);
  },

  async createCart(data) {
    return await cartRepository.create(data);
  },

  async updateCart(id, data) {
    return await cartRepository.update(id, data);
  },

  // outros métodos relacionados ao carrinho que precisar
});
