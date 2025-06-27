const CartResource = require("../resources/CartResource");

// services/CartService.js
module.exports = (cartRepository, cartItemRepository, productRepository) => ({
  async getActiveCartByUserId(user_id) {
    const cart = await cartRepository.findActiveCartByUserId(user_id);
    return CartResource.toResponse(cart);
  },

  async createCart(data) {
    await cartRepository.deactivateUserCarts(data.user_id);

    return await cartRepository.create(({
      user_id: data.user_id,
      title: data.title,
      total: data.total ?? 0.00,
      quantity: data.quantity ?? 0
    }));
  },

  async listCartsByUserId(user_id) {
    const carts = await cartRepository.findAllByUserId(user_id);
    return CartResource.collection(carts);
  },

  async addItemToCart(user_id, data) {
    try {
      const activeCart = await cartRepository.findActiveCartByUserId(user_id);
      const product = await productRepository.findById(data.product_id);

      if (!activeCart) throw new Error('Nenhum carrinho ativo encontrado');
      if (!product) throw new Error('Produto não encontrado');

      const itemTotal = data.quantity * data.price;

      await cartItemRepository.create({
        cart_id: activeCart.id,
        product_id: product.id,
        quantity: data.quantity,
        price: data.price,
      });

      // Atualiza total e quantidade do carrinho
      activeCart.total += itemTotal;
      activeCart.quantity += data.quantity;
      await activeCart.save();

      return { message: 'Item adicionado com sucesso', total: activeCart.total, quantity: activeCart.quantity };
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Erro ao adicionar item ao carrinho' });
    }
  },

  async getCart(user_id, cart_id) {
    const cart = await cartRepository.findById(user_id, cart_id);
    return CartResource.toResponse(cart);
  },

  async updateCartItem(user_id, itemData) {
    const activeCart = await cartRepository.findActiveCartByUserId(user_id);
    if (!activeCart) throw new Error('Carrinho ativo não encontrado');

    // Busca o item no carrinho
    const existingItem = await cartItemRepository.findByCartIdAndProductId(activeCart.id, itemData.product_id);
    if (!existingItem) throw new Error('Item não encontrado no carrinho');

    // Atualiza quantity e price (se fornecidos)
    const updateData = {};
    if (itemData.quantity !== undefined) updateData.quantity = itemData.quantity;
    if (itemData.price !== undefined) updateData.price = itemData.price;

    return await existingItem.update(updateData);
  }
  // outros métodos relacionados ao carrinho que precisar
});
