// src/controllers/ProductController.js
const productResource = require("../resources/ProductResource");

module.exports = (productService) => ({
  index: async (req, res) => {
    try {
      const products = await productService.index();
      res.json(productResource.collection(products));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  store: async (req, res) => {
    try {
      const data = req.body;
      const product = await productService.store(data);
      res.json(productResource.single(product));
    } catch (error) {
      const status = error.message === 'Produto já existe' ? 409 : 400;
      res.status(status).json({ error: error.message });
    }
  },

  show: async (req, res) => {
    try {
      const product = await productService.show(req.params.gtin);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
      res.json(productResource.single(product));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const product = await productService.update(req.params.id, req.body);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

      res.json(productResource.single(product));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  destroy: async (req, res) => {
    try {
      const id = Number(req.params.id);
      await productService.destroy(id);
      res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  search: async (req, res) => {
    try {
      const query = req.query.q || '';
      const results = await productService.search(query);
      res.json(productResource.collection(results));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  scan: async (req, res) => {
    try {
      const query = req.query.gtin || '';
      const result = await productService.scan(query);
      res.json(productResource.single(result));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
});
