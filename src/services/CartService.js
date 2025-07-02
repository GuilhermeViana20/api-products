// src/services/CartService.js
module.exports = (cartRepository, cartItemRepository, productRepository) => ({
  async all(user_id) {
    const carts = await cartRepository.get();
    return carts.filter(cart => Number(cart.user?.id) === Number(user_id));
  },

  async show(cart_id, user_id) {
    const carts = await cartRepository.get();

    const cart = carts.find(cart =>
      Number(cart.id) === Number(cart_id) &&
      Number(cart.user?.id) === Number(user_id)
    );

    return cart || null;
  },

  async store(cartData) {
    const id = await cartRepository.getLastId();
    const now = new Date().toISOString();

    const carts = await cartRepository.get();
    const userCarts = carts.filter(c => Number(c.user?.id) === Number(cartData.user_id));

    const activeCart = userCarts.find(c => c.is_active === true);
    if (activeCart) {
      await cartRepository.deactivateById(activeCart.id);
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
    const carts = await cartRepository.get();

    const activeCart = carts.find(
      (cart) => Number(cart.user?.id) === Number(user_id) && cart.is_active
    );

    return activeCart || null;
  },
});
