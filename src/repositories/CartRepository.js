// src/repositories/CartRepository.js
const { FLOAT } = require("sequelize");

module.exports = (sheets, spreadsheetId, userRepository) => {
  const range = 'carts!A2:H';
  const getLocalDateTime = require('../utils/getLocalDateTime');

  async function getAllRows(user_id) {
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = response.data.values || [];

    return rows
        .filter(row => row.length >= 8 && row[7] && Number(row[7]) === user_id)
        .map(row => ({
          id: Number(row[0]),
          store_name: row[1],
          total: parseFloat(row[2]) || 0,
          quantity: Number(row[3]),
          is_active: Number(row[4]) === 1,
          created_at: row[5],
          updated_at: row[6],
          user_id: Number(row[7])
        }));
  }

  async function getNextIdAndNow() {
    const id = await lastItem();
    const now = getLocalDateTime();
    return { id, now };
  }

  function buildCartRow({ id, store_name, total, quantity, user_id, is_active = 1, created_at, updated_at }) {
    return [
      id,
      store_name,
      Number(total).toFixed(2),
      Number(quantity),
      is_active,
      created_at,
      updated_at,
      user_id.toString()
    ];
  }

  async function lastItem() {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'carts!A2:A',
    });

    const values = response.data.values || [];

    if (values.length === 0) return 1;

    const ids = values
        .map(row => parseInt(row[0]))
        .filter(id => !isNaN(id));

    return Math.max(...ids, 0) + 1;
  }

  return {
    index: async (user_id) => {
      return await getAllRows(user_id);
    },

    create: async (cartData) => {
      const { id, now } = await getNextIdAndNow();
      const cartRow = buildCartRow({
        id,
        store_name: cartData.store_name,
        total: cartData.total || 0,
        quantity: cartData.quantity || 0,
        user_id: cartData.user_id,
        is_active: 1,
        created_at: now,
        updated_at: now
      });

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: { values: [cartRow] }
      });

      return { id, ...cartData, created_at: now, updated_at: now, is_active: 1 };
    },

    lastItem,

    deactivate: async (cart_id) => {
      const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
      const rows = res.data.values || [];
      const rowIndex = rows.findIndex(row => Number(row[0]) === cart_id);

      if (rowIndex === -1) return;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `carts!E${rowIndex + 2}`,
        valueInputOption: 'RAW',
        resource: { values: [[0]] }
      });
    },

    update: async (cartId, data) => {
      const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
      const rows = response.data.values || [];
      const rowIndex = rows.findIndex(row => Number(row[0]) === Number(cartId));
      if (rowIndex === -1) throw new Error('Carrinho não encontrado');

      const row = rows[rowIndex];
      const updatedRow = [
        cartId,
        row[1], // store_name
        data.total.toString(),
        data.quantity.toString(),
        row[4], // is_active
        row[5], // created_at
        data.updated_at,
        row[7]  // user_id
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `carts!A${rowIndex + 2}:H${rowIndex + 2}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [updatedRow] }
      });
    },

    updateQuantity: async (cart_id, product_id, quantity) => {
      // Precisa do método getAllItems() implementado em outro lugar
      const items = await getAllItems();
      const itemIndex = items.findIndex(item => item.cart_id == cart_id && item.product_id == product_id);
      if (itemIndex === -1) throw new Error('Item não encontrado');

      items[itemIndex].quantity = quantity;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `cart_items!A${itemIndex + 2}:G${itemIndex + 2}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values: [Object.values(items[itemIndex])] }
      });
    }
  };
};
