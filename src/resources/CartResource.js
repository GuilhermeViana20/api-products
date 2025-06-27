const formatPrice = require('../utils/formatPrice');

const CartResource = {
  toResponse: (cart) => {
    return {
      id: cart.id,
      store_name: cart.title,
      quantity: cart.items?.length || 0,
      quantity_term: `${cart.items?.length || 0} produtos`,
      is_active: cart.is_active,
      description: cart.description,
      total: formatPrice(cart.total),
      products: cart.items?.map(item => ({
        id: item.product?.id,
        name: item.product?.name,
        image: item.product?.image,
        price: formatPrice(item.price),
        quantity: item.quantity,
      })) || [],
    };
  },

  collection: (carts) => carts.map(CartResource.toResponse),
};

module.exports = CartResource;
