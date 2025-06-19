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
      const userId = req.params.id;
      const cart = await cartService.createCart({ ...req.body, userId });
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar carrinho' });
    }
  },

  async addItemToCart(req, res) {
    try {
      const userId = req.params.id;
      const itemData = req.body;
      const item = await cartService.addItemToCart(userId, itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao adicionar item ao carrinho' });
    }
  },

  async getCart(req, res) {
    try {
      const userId = req.params.id;
      const cartId = req.params.cartId;
      const cart = await cartService.getCart(userId, cartId);

      if (!cart) return res.status(404).json({ error: 'Carrinho não encontrado' });

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar o carrinho' });
    }
  },

  async listCarts(req, res) {
    try {
      const userId = req.params.id;
      const carts = await cartService.listCartsByUserId(userId);
      res.json(carts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar carrinhos' });
    }
  },

  async updateCartItem(req, res) {
    try {
      const userId = req.params.id;
      const itemData = req.body;

      const updatedItem = await cartService.updateCartItem(userId, itemData);
      res.json(updatedItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar item do carrinho' });
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
