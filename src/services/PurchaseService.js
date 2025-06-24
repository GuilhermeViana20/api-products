// services/PurchaseService.js
module.exports = (purchaseRepository) => ({
  async getPurchasesByUserId(user_id) {
    return await purchaseRepository.findByUserId(user_id);
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
