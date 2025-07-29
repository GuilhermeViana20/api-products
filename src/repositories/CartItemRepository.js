// src/repositories/CartItemRepository.js
module.exports = (sheets, spreadsheetId, productRepository) => {
  const range = 'cart_items!A2:I';

  return {
    async getItemsByCartId(cart_id) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values || [];

      const filteredRows = rows.filter(row => Number(row[6]) === Number(cart_id));

      const items = await Promise.all(filteredRows.map(async row => {
        const productId = Number(row[7]);
        const product = await productRepository.find(productId);

        if (!product) return null;

        return {
          id: Number(row[0]),
          price_un: parseFloat(row[1]),
          price: parseFloat(row[2]),
          quantity: Number(row[3]),
          created_at: row[4],
          updated_at: row[5],
          cart_id: Number(row[6]),
          product_id: productId,
          deleted_at: row[8],
          product,
        };
      }));

      return items.filter(item => item !== null);
    },

    async addItem(data) {
      const newRow = [
        data.id,
        data.price_un,
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

    async markDeleted(itemId, deleted_at) {
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
        row[1],           // price_un
        row[2],           // price
        row[3],           // quantity
        row[4],           // created_at
        row[5],           // updated_at
        row[6],           // cart_id
        row[7],           // product_id
        deleted_at,        // deleted_at (última coluna)
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `cart_items!A${rowIndex + 2}:I${rowIndex + 2}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [updatedRow] }
      });
    },

    async updateQuantity(cart_id, product_id, quantity) {
      const items = await getAllItems();
      const index = items.findIndex(
        item => item.cart_id === cart_id && item.product_id === product_id
      );
      if (index === -1) throw new Error('Item não encontrado');

      items[index].quantity = quantity;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `cart_items!A${index + 2}:G${index + 2}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [Object.values(items[index])] }
      });
    }
};
};
