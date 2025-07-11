const formatPrice = require('../utils/formatPrice');

const CartResource = {
  toJSON(cart) {
    return {
      id: Number(cart.id),
      store_name: cart.store_name,
      quantity: cart.quantity,
      quantity_term: `${cart.quantity} produtos`,
      is_active: cart.is_active,
      description: cart.description,
      total: formatPrice(cart.total),
      products: cart.products?.map(item => ({
        id: item.product?.id,
        name: item.product?.name,
        image: item.product?.image,
        price: formatPrice(item.price),
        quantity: item.quantity,
      })) || [],
    };
  },

  collection(carts, currentPage = 1, perPage = 10, total = 0) {
    return {
      message: 'Carrinhos retornados com sucesso!',
      carts: carts.map(this.toJSON),
      meta: {
        total,
        per_page: perPage,
        current_page: currentPage,
        last_page: Math.ceil(total / perPage),
      }
    };
  },

  single(cart) {
    return {
      message: 'Carrinho retornado com sucesso!',
      cart: this.toJSON(cart),
    };
  }
};

module.exports = CartResource;
