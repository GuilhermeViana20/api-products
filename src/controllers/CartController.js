// src/controllers/CartController.js
const cartResource = require('../resources/CartResource');

module.exports = (cartService) => ({
  async index(req, res) {
    const { user_id } = req.params;

    try {
      const carts = await cartService.index(user_id);
      res.json(cartResource.collection(carts));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar carrinhos' });
    }
  },

  async show(req, res) {
    const { cart_id, user_id } = req.params;

    try {
      const cart = await cartService.show(cart_id, user_id);
      if (!cart) return res.status(404).json({ error: 'Carrinho não encontrado' });
      res.json(cartResource.single(cart));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar carrinho' });
    }
  },

  async store(req, res) {
    const { user_id } = req.params;
    const { title, total, quantity } = req.body;

    try {
      const newCart = await cartService.store({
        user_id,
        title,
        total,
        quantity,
      });

      res.status(201).json(cartResource.single(newCart));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar carrinho' });
    }
  },

  async active(req, res) {
    const user_id = req.params.id;

    try {
      const activeCart = await cartService.active(user_id);
      if (!activeCart) return res.status(404).json({ error: 'Carrinho ativo não encontrado' });
      res.json(cartResource.single(activeCart));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar carrinho ativo' });
    }
  },

  async addToCart(req, res) {
    const user_id = req.params.id;
    const { product_id, price, quantity } = req.body;

    try {
      const cartUpdated = await cartService.addToCart(user_id, { product_id, price, quantity });
      res.json(cartResource.single(cartUpdated));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
});
