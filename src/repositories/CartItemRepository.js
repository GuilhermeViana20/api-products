// repositories/CartItemRepository.js
module.exports = (CartItemModel) => ({
  create: async (data) => {
    return await CartItemModel.create(data);
  },

  findByCartIdAndProductId: async (cartId, productId) => {
    return await CartItemModel.findOne({
      where: { CartId: cartId, ProductId: productId }
    });
  },
});