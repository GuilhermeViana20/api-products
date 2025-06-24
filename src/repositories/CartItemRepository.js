// repositories/CartItemRepository.js
module.exports = (CartItemModel) => ({
  create: async (data) => {
    return await CartItemModel.create(data);
  },

  findByCartIdAndProductId: async (cart_id, product_id) => {
    return await CartItemModel.findOne({
      where: { cart_id: cart_id, product_id: product_id }
    });
  },
});