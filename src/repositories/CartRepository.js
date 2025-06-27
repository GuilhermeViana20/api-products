const { Cart, CartItem, Product } = require('../models');

// repositories/CartRepository.js
module.exports = (CartModel) => ({
  create: async (data) => {
    return await CartModel.create(data);
  },

  deactivateUserCarts: async (user_id) => {
    await CartModel.update({ is_active: false }, { where: { user_id: user_id } });
  },

  findActiveCartByUserId: async (user_id) => {
    const cart = await CartModel.findOne({ where: { user_id: user_id, is_active: true } });
    if (!cart) throw new Error('Carrinho não encontrado');
    return cart;
  },

  findById: async (user_id, cart_id) => {
    return await CartModel.findOne({
      where: { id: cart_id, user_id: user_id },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
            }
          ]
        }
      ]
    });
  },

  findAllByUserId: async (user_id) => {
    return await CartModel.findAll({
      where: { user_id: user_id, is_active: false },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
            }
          ]
        }
      ]
    });
  },

  update: async (id, data) => {
    const cart = await CartModel.findByPk(id);
    if (!cart) return null;
    return await cart.update(data);
  },
});
