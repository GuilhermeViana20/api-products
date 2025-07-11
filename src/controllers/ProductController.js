// src/controllers/ProductController.js
const productResource = require("../resources/ProductResource");

module.exports = (productService) => ({
  index: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = 10;

      const products = await productService.index(page, perPage);

      res.json(productResource.collection(products.data, page, perPage, products.total));
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
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.per_page) || 10;

      const results = await productService.search(query);

      const total = results.length;
      const offset = (page - 1) * perPage;
      const paginated = results.slice(offset, offset + perPage);

      res.json(productResource.collection(paginated, page, perPage, total));
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
