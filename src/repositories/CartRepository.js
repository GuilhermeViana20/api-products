// repositories/CartRepository.js
module.exports = (CartModel) => ({
  findActiveByUserId: async (userId) => {
    return await CartModel.findOne({ where: { UserId: userId, isActive: true } });
  },

  create: async (data) => {
    return await CartModel.create(data);
  },

  update: async (id, data) => {
    const cart = await CartModel.findByPk(id);
    if (!cart) return null;
    return await cart.update(data);
  },
});
