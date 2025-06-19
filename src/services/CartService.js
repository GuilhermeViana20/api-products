// services/CartService.js
module.exports = (cartRepository, cartItemRepository, productRepository) => ({
  async getActiveCartByUserId(userId) {
    return await cartRepository.findActiveByUserId(userId);
  },

  async createCart(data) {
    await cartRepository.deactivateUserCarts(data.userId);

    return await cartRepository.create(({
      UserId: data.userId,
      title: data.title
    }));
  },

  async listCartsByUserId(userId) {
    return await cartRepository.findAllByUserId(userId);
  },

  async addItemToCart(userId, data) {
    try {
      const activeCart = await cartRepository.findActiveCartByUserId(userId);
      const product = await productRepository.findById(data.productId);

      if (!activeCart) throw new Error('Nenhum carrinho ativo encontrado');
      if (!product) throw new Error('Produto não encontrado');

      return await cartItemRepository.create({
        CartId: activeCart.id,
        ProductId: product.id,
        quantity: data.quantity,
        price: data.price,
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao adicionar item ao carrinho' });
    }
  },

  async getCart(userId, cartId) {
    return await cartRepository.findById(userId, cartId);
  },

  async updateCartItem(userId, itemData) {
    const activeCart = await cartRepository.findActiveCartByUserId(userId);
    if (!activeCart) throw new Error('Carrinho ativo não encontrado');

    // Busca o item no carrinho
    const existingItem = await cartItemRepository.findByCartIdAndProductId(activeCart.id, itemData.productId);
    if (!existingItem) throw new Error('Item não encontrado no carrinho');

    // Atualiza quantity e price (se fornecidos)
    const updateData = {};
    if (itemData.quantity !== undefined) updateData.quantity = itemData.quantity;
    if (itemData.price !== undefined) updateData.price = itemData.price;

    return await existingItem.update(updateData);
  }
  // outros métodos relacionados ao carrinho que precisar
});
