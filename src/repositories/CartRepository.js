// repositories/CartRepository.js
module.exports = (CartModel) => ({
  create: async (data) => {
    return await CartModel.create(data);
  },

  deactivateUserCarts: async (userId) => {
    await CartModel.update(
      { isActive: false },
      { where: { UserId: userId } }
    );
  },

  findActiveCartByUserId: async (userId) => {
    const cart = await CartModel.findOne({
      where: { UserId: userId, isActive: true },
    });

    if (!cart) throw new Error('Carrinho não encontrado');

    return cart;
  },

  findActiveByUserId: async (userId) => {
    return await CartModel.findOne({ where: { UserId: userId, isActive: true } });
  },

  findById: async (userId, cartId) => {
    return await CartModel.findOne({ where: { UserId: userId, id: cartId } });
  },

  findAllByUserId: async (userId) => {
    return await CartModel.findAll({ where: { UserId: userId } });
  },

  update: async (id, data) => {
    const cart = await CartModel.findByPk(id);
    if (!cart) return null;
    return await cart.update(data);
  },
});
