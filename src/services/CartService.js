const getLocalDateTime = require('../utils/getLocalDateTime');

module.exports = (cartRepository, cartItemRepository) => {
  async function getNextIdAndNow() {
    const id = await cartRepository.lastItem();
    const now = getLocalDateTime();
    return { id, now };
  }

  async function deactivateActiveCart(user_id) {
    const activeCart = await this.active(user_id);
    if (activeCart) {
      await cartRepository.deactivate(activeCart.id);
    }
  }

  return {
    async index(user_id) {
      const carts = await cartRepository.index(user_id);
      const inactives = carts.filter(cart => !cart.is_active);
      const cartsWithItems = await Promise.all(inactives.map(async (cart) => {
        const items = await cartItemRepository.getItemsByCartId(cart.id);
        return { ...cart, items };
      }));
      return cartsWithItems;
    },

    async show(cart_id, user_id) {
      const carts = await cartRepository.index(user_id);
      const cart = carts.find(cart => cart && cart.id === cart_id);
      if (!cart) return null;
      const items = await cartItemRepository.getItemsByCartId(cart.id);
      return { ...cart, items };
    },

    async store(store_name, user_id) {
      const { id, now } = await getNextIdAndNow();
      await deactivateActiveCart.call(this, user_id);

      const cart = {
        id,
        store_name,
        total: 0.00,
        quantity: 0,
        user_id,
        is_active: 1,
        created_at: now,
        updated_at: now,
      };

      await cartRepository.create(cart);
      return cart;
    },

    async active(user_id) {
      const carts = await cartRepository.index(user_id);
      const activeCart = carts.find(cart => cart.is_active);
      if (!activeCart) return null;
      const items = await cartItemRepository.getItemsByCartId(activeCart.id);
      return { ...activeCart, items };
    },

    async updateQuantity(cart_id, product_id, quantity) {
      await cartItemRepository.updateQuantity(cart_id, product_id, quantity);
      return await cartItemRepository.getItem(cart_id, product_id);
    },

    async addToCart(user_id, { product_id, price, quantity }) {
      const cart = await this.active(user_id);
      if (!cart) throw new Error('Carrinho ativo não encontrado');

      const items = await cartItemRepository.getItemsByCartId(cart.id);
      const exists = items.some(item => item.product_id === product_id);
      if (exists) throw new Error('Já existe o item no carrinho');

      const itemId = await cartItemRepository.lastItem();
      const now = getLocalDateTime();

      const newItem = {
        id: itemId,
        price_un: price,
        price: price * quantity,
        quantity,
        created_at: now,
        updated_at: now,
        cart_id: cart.id,
        product_id,
      };

      await cartItemRepository.addItem(newItem);

      const newTotal = cart.total + (price * quantity);
      const newQuantity = cart.quantity + quantity;

      await cartRepository.update(cart.id, {
        total: newTotal.toFixed(2),
        quantity: newQuantity,
        updated_at: now
      });

      cart.total = newTotal;
      cart.quantity = newQuantity;
      cart.updated_at = now;

      const updatedItems = await cartItemRepository.getItemsByCartId(cart.id);
      return { ...cart, items: updatedItems };
    },

    async removeToCart(user_id, { product_id }) {
      const cart = await this.active(user_id);
      if (!cart) throw new Error('Carrinho ativo não encontrado');

      const items = await cartItemRepository.getItemsByCartId(cart.id);
      const item = items.find(i => i.product_id === product_id && !i.deleted_at);
      if (!item) throw new Error('Produto não encontrado no carrinho');

      const deletedAt = new Date().toISOString();
      await cartItemRepository.markDeleted(item.id, deletedAt);

      return await this.show(cart.id, user_id);
    }
  };
};
