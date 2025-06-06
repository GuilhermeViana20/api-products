// controllers/PurchaseController.js
module.exports = (purchaseService) => ({
  async createPurchase(req, res) {
    const userId = req.params.userId;
    const { total } = req.body;

    try {
      const purchase = await purchaseService.createPurchase(userId, total);
      res.status(201).json(purchase);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar compra' });
    }
  },

  async listPurchases(req, res) {
    const userId = req.params.userId;

    try {
      const purchases = await purchaseService.getPurchasesByUser(userId);
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar compras' });
    }
  },
});
