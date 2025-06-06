// controllers/CartController.js
module.exports = (cartService) => ({
  async getActiveCart(req, res) {
    const userId = req.params.id;
    try {
      const cart = await cartService.getActiveCartByUserId(userId);
      if (!cart) return res.status(404).json({ error: 'Carrinho ativo não encontrado' });
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar carrinho' });
    }
  },

  async createCart(req, res) {
    try {
      const cart = await cartService.createCart(req.body);
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar carrinho' });
    }
  },

  async updateCart(req, res) {
    const cartId = req.params.id;
    try {
      const updatedCart = await cartService.updateCart(cartId, req.body);
      if (!updatedCart) return res.status(404).json({ error: 'Carrinho não encontrado' });
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar carrinho' });
    }
  },

  async deleteCart(req, res) {
    const cartId = req.params.id;
    try {
      const deleted = await cartService.deleteCart(cartId);
      if (!deleted) return res.status(404).json({ error: 'Carrinho não encontrado' });
      res.json({ message: 'Carrinho removido' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar carrinho' });
    }
  },
});
