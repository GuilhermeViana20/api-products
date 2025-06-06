// repositories/PurchaseRepository.js
module.exports = (PurchaseModel) => ({
  findByUserId: async (userId) => {
    return await PurchaseModel.findAll({ where: { UserId: userId } });
  },

  create: async (data) => {
    return await PurchaseModel.create(data);
  },

  findById: async (id) => {
    return await PurchaseModel.findByPk(id);
  },

  update: async (id, data) => {
    const purchase = await PurchaseModel.findByPk(id);
    if (!purchase) return null;
    return await purchase.update(data);
  },

  delete: async (id) => {
    const purchase = await PurchaseModel.findByPk(id);
    if (!purchase) return null;
    await purchase.destroy();
    return true;
  },
});
