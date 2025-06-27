module.exports = (productService) => ({
  search: async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) return res.status(400).json({ error: 'Parâmetro de busca "q" é obrigatório' });

      const products = await productService.searchProducts(q);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const { barcode, price } = req.body;
      const product = await productService.createProduct(barcode, price);
      res.status(201).json(product);
    } catch (error) {
      const status = error.message === 'Produto já existe' ? 409 : 400;
      res.status(status).json({ error: error.message });
    }
  },

  getByGtin: async (req, res) => {
    try {
      const product = await productService.getProduct(req.params.gtin);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const products = await productService.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      console.log('Produto atualizado:', product);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

      res.json({
        message: 'Produto atualizado com sucesso',
        product: product,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await productService.deleteProduct(req.params.id);
      res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  consultProduct: async (req, res) => {
    try {
      const { gtin } = req.query;
      if (!gtin) return res.status(400).json({ error: 'Parâmetro gtin é obrigatório' });

      const product = await productService.scan(gtin);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});
