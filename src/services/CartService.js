// src/services/CartService.js
const getLocalDateTime = require('../utils/getLocalDateTime');
const now = getLocalDateTime();

module.exports = (cartRepository, cartItemRepository) => ({
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

    const cart = carts.find(cart =>
      Number(cart.id) === Number(cart_id)
    );

    return cart || null;
  },

  async store(cartData) {
    const id = await cartRepository.lastItem();
    const now = getLocalDateTime();

    const carts = await cartRepository.index();
    const userCarts = carts.filter(c => Number(c.user?.id) === Number(cartData.user_id));

    const activeCart = userCarts.find(c => c.is_active === true);
    if (activeCart) {
      await cartRepository.deactivate(activeCart.id);
    }

    const cart = {
      id: id.toString(),
      title: cartData.title ?? '',
      total: cartData.total ?? '0',
      quantity: cartData.quantity ?? '0',
      user_id: cartData.user_id.toString(),
      is_active: true,
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

  async addToCart(user_id, { product_id, price, quantity }) {
    const cart = await this.active(user_id);
    if (!cart) throw new Error('Carrinho ativo não encontrado');

    const itemId = await cartItemRepository.lastItem();

    const newItem = {
      id: itemId,
      price,
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

    const items = await cartItemRepository.getItemsByCartId(cart.id);
    return { ...cart, items };
  },
});
