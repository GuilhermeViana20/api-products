const cartResource = require('../resources/CartResource');
const formatPrice = require('../utils/formatPrice');

module.exports = (cartService, pdfKit) => ({
  async index(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.per_page) || 5;

      const carts = await cartService.index(req.user.id);

      const total = carts.length;
      const offset = (page - 1) * perPage;
      const paginated = carts.slice(offset, offset + perPage);

      res.json(cartResource.collection(paginated, page, perPage, total));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao listar carrinhos' });
    }
  },

  async show(req, res) {
    try {
      const cart_id = Number(req.params.cart_id);
      const user_id = Number(req.user.id);

      const cart = await cartService.show(cart_id, user_id);
      if (!cart) return res.status(404).json({ error: 'Carrinho não encontrado' });

      res.json(cartResource.single(cart));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar carrinho' });
    }
  },

  async store(req, res) {
    try {
      const store_name = req.body.store_name?.trim();
      const user_id = Number(req.user.id);

      if (!store_name) return res.status(400).json({ error: 'Nome da loja é obrigatório' });

      const newCart = await cartService.store(store_name, user_id);
      res.status(201).json(cartResource.single(newCart));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar carrinho' });
    }
  },

  async active(req, res) {
    try {
      const activeCart = await cartService.active(req.user.id);
      if (!activeCart) return res.status(404).json({ error: 'Carrinho ativo não encontrado' });

      res.json(cartResource.single(activeCart));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar carrinho ativo' });
    }
  },

  async update(req, res) {
    try {
      const cart_id = Number(req.params.cart_id);
      const product_id = Number(req.params.product_id);
      const { quantity } = req.body;

      const updatedItem = await cartService.updateQuantity(cart_id, product_id, quantity);
      res.json(updatedItem);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar item do carrinho' });
    }
  },

  async addToCart(req, res) {
    try {
      const { product_id, price, quantity } = req.body;
      const cartUpdated = await cartService.addToCart(req.user.id, { product_id, price, quantity });
      res.json(cartResource.single(cartUpdated));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  async removeToCart(req, res) {
    try {
      const { product_id } = req.body;
      const cartUpdated = await cartService.removeToCart(req.user.id, { product_id });
      res.json(cartResource.single(cartUpdated));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  async generatePdf(req, res) {
    try {
      const cart_id = Number(req.params.cart_id);
      const user_id = Number(req.user.id);

      const cart = await cartService.show(cart_id, user_id);
      if (!cart) return res.status(404).json({ error: 'Carrinho não encontrado' });

      const doc = new pdfKit({ size: 'A4', margin: 50 });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="carrinho-${cart_id}.pdf"`);

      doc.pipe(res);

      doc
          .fontSize(12)
          .font('Courier-Bold')
          .text('GUILHERME SISTEMAS LTDA', { align: 'center' })
          .text('FORTALEZA - CE', { align: 'center' })
          .moveDown(0.1);

      doc
          .text('--------------------------------------------------------------------', { align: 'center' })
          .moveDown(0.1);

      doc
          .text('Extrato Nº 1', { align: 'center' })
          .text('CUPOM FISCAL DIGITAL', { align: 'center' })
          .moveDown(0.1);

      doc
          .text('--------------------------------------------------------------------', { align: 'center' })
          .moveDown(2);

      doc
          .font('Courier-Bold')
          .text('#      CÓDIGO              QTD            VL. UNIT    VL. TOTAL');

      doc.text('--------------------------------------------------------------------');

      doc.font('Courier');

      cart.items.forEach((item, i) => {
        const code = String(i + 1).padStart(3, '0');
        const gtin = item.product?.gtin?.toString().padStart(16);
        const qtd = item.quantity.toString().padStart(8);
        const priceUn = formatPrice(item.price_un).padStart(20);
        const priceTotal = formatPrice(item.price).padStart(11);

        const line = `${code} ${gtin} ${qtd} ${priceUn} ${priceTotal}`;
        doc.text(line);
      });

      doc.text('--------------------------------------------------------------------');

      const totalQuantity = cart.items.reduce((acc, item) => acc + item.quantity, 0);

      doc.moveDown(2);
      doc.font('Courier-Bold').text(`Qtde. total de itens`.padEnd(55) + totalQuantity.toString().padStart(10));
      doc.text(`Valor Pago`.padEnd(55) + formatPrice(cart.total).padStart(10));

      doc.moveDown(2);
      doc.fontSize(10).text('Obrigado pela preferência!', { align: 'center' });

      doc.end();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao gerar nota fiscal' });
    }
  },
});
