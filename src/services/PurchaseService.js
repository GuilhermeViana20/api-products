// services/PurchaseService.js
module.exports = (purchaseRepository) => ({
  async getPurchasesByUserId(userId) {
    return await purchaseRepository.findByUserId(userId);
  },

  async createPurchase(data) {
    return await purchaseRepository.create(data);
  },

  async getPurchaseById(id) {
    return await purchaseRepository.findById(id);
  },

  async updatePurchase(id, data) {
    return await purchaseRepository.update(id, data);
  },

  async deletePurchase(id) {
    return await purchaseRepository.delete(id);
  },
});
