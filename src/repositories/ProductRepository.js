// src/repositories/ProductRepository.js
const getLocalDateTime = require('../utils/getLocalDateTime');

module.exports = (sheets, spreadsheetId) => {
  const range = 'products!A2:K';

  const self = {
    async index() {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values || [];

      return rows
        .filter(row => row && row.length >= 1 && row[0])
        .filter(row => !row[10])
        .map((row) => ({
          id: Number(row[0]),
          name: row[1] || '',
          description: row[2] || '',
          gtin: Number(row[3]),
          image: row[4] || '',
          avg_price: row[5] || '0.00',
          price: row[6] || '0.00',
          barcode_image: row[7] || '',
          created_at: row[8] || '',
          updated_at: row[9] || '',
          deleted_at: row[10] || '',
        }));
    },

    async store(data) {
      const id = await self.lastItem();

      const newRow = [
        id,
        data.name || '',
        data.description || '',
        data.gtin,
        data.image || '',
        data.avg_price || '0.00',
        data.price || '0.00',
        data.barcode_image || '',
        getLocalDateTime(),
        getLocalDateTime(),
        ''
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values: [newRow] },
      });

      return {
        id: Number(id),
        name: data.name,
        description: data.description,
        gtin: data.gtin,
        image: data.image,
        avg_price: data.avg_price,
        price: data.price,
        barcode_image: data.barcode_image,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    },

    async show(gtin) {
      const products = await self.index();
      return products.find(p => Number(p.gtin) === Number(gtin)) || null;
    },

    async update(id, data) {
      const formatNumber = (value) => {
        const num = parseFloat(
          String(value).replace(/[^\d.,-]/g, '').replace(',', '.')
        );
        return isNaN(num) ? '0.00' : num.toFixed(2);
      };
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values || [];

      const rowIndex = rows.findIndex(row => Number(row[0]) === id);
      if (rowIndex === -1) throw new Error('Produto não encontrado');

      const updatedRow = [
        id,
        data.name || '',
        data.description || '',
        data.gtin,
        data.image || '',
        formatNumber(data.avg_price),
        formatNumber(data.price),
        data.barcode_image || '',
        data.created_at || rows[rowIndex][8],
        getLocalDateTime(),
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `products!A${rowIndex + 2}:J${rowIndex + 2}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [updatedRow] },
      });

      return {
        id,
        ...data,
      };
    },

    async destroy(id) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values || [];

      const rowIndex = rows.findIndex(row => Number(row[0]) === id);
      if (rowIndex === -1) throw new Error('Linha não encontrada');

      const deletedAt = getLocalDateTime();
      const cell = `K${rowIndex + 2}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `products!${cell}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[deletedAt]],
        },
      });
    },

    async lastItem() {
      const products = await self.index();
      const ids = products.map(p => p.id);
      return (Math.max(...ids, 0) + 1);
    },
  };

  return self;
};
