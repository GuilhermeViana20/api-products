// repositories/CartRepository.js
module.exports = (CartModel) => ({
  create: async (data) => {
    return await CartModel.create(data);
  },

  deactivateUserCarts: async (user_id) => {
    await CartModel.update(
      { isActive: false },
      { where: { user_id: user_id } }
    );
  },

  findActiveCartByUserId: async (user_id) => {
    const cart = await CartModel.findOne({
      where: { user_id: user_id, is_active: true },
    });

    if (!cart) throw new Error('Carrinho não encontrado');

    return cart;
  },

  findActiveByUserId: async (user_id) => {
    return await CartModel.findOne({ where: { user_id: user_id, isActive: true } });
  },

  findById: async (user_id, cart_id) => {
    return await CartModel.findOne({ where: { id: cart_id, user_id: user_id } });
  },

  findAllByUserId: async (user_id) => {
    return await CartModel.findAll({ where: { user_id: user_id } });
  },

  update: async (id, data) => {
    const cart = await CartModel.findByPk(id);
    if (!cart) return null;
    return await cart.update(data);
  },
});
