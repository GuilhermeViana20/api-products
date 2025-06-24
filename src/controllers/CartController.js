// controllers/CartController.js
module.exports = (cartService) => ({
  async getActiveCart(req, res) {
    const user_id = req.params.id;
    try {
      const cart = await cartService.getActiveCartByUserId(user_id);
      if (!cart) return res.status(404).json({ error: 'Carrinho ativo não encontrado' });
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar carrinho' });
    }
  },

  async createCart(req, res) {
    try {
      const user_id = req.params.id;
      const cart = await cartService.createCart({ ...req.body, user_id });
      res.status(201).json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar carrinho' });
    }
  },

  async addItemToCart(req, res) {
    try {
      const user_id = req.params.id;
      const itemData = req.body;
      const item = await cartService.addItemToCart(user_id, itemData);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao adicionar item ao carrinho' });
    }
  },

  async getCart(req, res) {
    try {
      const user_id = req.params.id;
      const cart_id = req.params.cart_id;
      const cart = await cartService.getCart(user_id, cart_id);

      if (!cart) return res.status(404).json({ error: 'Carrinho não encontrado' });

      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar o carrinho' });
    }
  },

  async listCarts(req, res) {
    try {
      const user_id = req.params.id;
      const carts = await cartService.listCartsByUserId(user_id);
      res.json(carts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar carrinhos' });
    }
  },

  async updateCartItem(req, res) {
    try {
      const user_id = req.params.id;
      const itemData = req.body;

      const updatedItem = await cartService.updateCartItem(user_id, itemData);
      res.json(updatedItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar item do carrinho' });
    }
  },

  async deleteCart(req, res) {
    const cart_id = req.params.id;
    try {
      const deleted = await cartService.deleteCart(cart_id);
      if (!deleted) return res.status(404).json({ error: 'Carrinho não encontrado' });
      res.json({ message: 'Carrinho removido' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar carrinho' });
    }
  },
});
