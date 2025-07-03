// src/repositories/CartItemRepository.js
module.exports = (sheets, spreadsheetId, productRepository) => {
  const range = 'cart_items!A2:G';

  return {
    async getItemsByCartId(cart_id) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values || [];

      const filteredRows = rows.filter(row => Number(row[5]) === Number(cart_id));

      const items = await Promise.all(filteredRows.map(async row => {
        const productId = Number(row[6]);
        const product = await productRepository.find(productId);

        if (!product) return null;

        return {
          id: Number(row[0]),
          price: parseFloat(row[1]),
          quantity: Number(row[2]),
          created_at: row[3],
          updated_at: row[4],
          cart_id: Number(row[5]),
          product_id: productId,
          deleted_at: row[7],
          product,
        };
      }));

      return items.filter(item => item !== null);
    },

    async addItem(data) {
      const newRow = [
        data.id,
        data.price,
        data.quantity,
        data.created_at,
        data.updated_at,
        data.cart_id,
        data.product_id
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [newRow],
        },
      });
    },

    async lastItem() {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const values = response.data.values || [];

      if (values.length === 0) return 1;

      const ids = values
        .map((row) => parseInt(row[0]))
        .filter((id) => !isNaN(id));

      const lastId = Math.max(...ids, 0);

      return lastId + 1;
    },

    async markDeleted(itemId, deletedAt) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => Number(row[0]) === Number(itemId));
      if (rowIndex === -1) throw new Error('Item do carrinho não encontrado');

      const row = rows[rowIndex];
      const updatedRow = [
        row[0],           // id
        row[1],           // price
        row[2],           // quantity
        row[3],           // created_at
        row[4],           // updated_at
        row[5],           // cart_id
        row[6],           // product_id
        deletedAt,        // deleted_at (última coluna)
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `cart_items!A${rowIndex + 2}:H${rowIndex + 2}`, // considere que H é a 8ª coluna
        valueInputOption: 'USER_ENTERED',
        resource: { values: [updatedRow] }
      });
    }
  };
};
