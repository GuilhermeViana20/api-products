// src/controllers/CartController.js
module.exports = (cartService) => ({
  async index(req, res) {
    const { user_id } = req.params;

    try {
      const carts = await cartService.all(user_id);
      res.json(carts);
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
      res.json(cart);
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

      res.status(201).json(newCart);
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
      res.json(activeCart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar carrinho ativo' });
    }
  },
});
