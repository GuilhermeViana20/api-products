module.exports = (productService) => ({
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

  getById: async (req, res) => {
    try {
      const product = await productService.getProductById(req.params.id);
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
      await productService.updateProduct(req.params.id, req.body);
      res.json({ message: 'Produto atualizado com sucesso' });
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
});
