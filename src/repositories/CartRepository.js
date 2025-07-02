// src/repositories/CartRepository.js
const createUserRepository = require('./UserRepository');

module.exports = (sheets, spreadsheetId) => {
  const userRepository = createUserRepository(sheets, spreadsheetId);

  return {
    async get() {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'carts!A2:H',
      });

      const rows = response.data.values || [];

      const carts = await Promise.all(rows.map(async (row) => {
        const user_id = row[7];
        const user = await userRepository.find(user_id);

        return {
          id: Number(row[0]),
          title: row[1],
          total: row[2],
          quantity: Number(row[3]),
          is_active: row[4]?.toString().toLowerCase() === 'true',
          user,
        };
      }));

      return carts;
    },

    async create(cartData) {
      const {
        id,
        title,
        total,
        quantity,
        is_active,
        created_at,
        updated_at,
        user_id,
      } = cartData;

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'carts!A2:H',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [[
            id.toString(),
            title,
            total.toString(),
            quantity.toString(),
            is_active ? true : false,
            created_at,
            updated_at,
            user_id.toString()
          ]],
        },
      });
    },

    async getLastId() {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'carts!A2:A',
      });

      const values = response.data.values || [];

      if (values.length === 0) return 1;

      const ids = values
        .map((row) => parseInt(row[0]))
        .filter((id) => !isNaN(id));

      const lastId = Math.max(...ids, 0);

      return lastId + 1;
    },

    async deactivateById(cartId) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'carts!A2:H',
      });

      const rows = response.data.values || [];

      const rowIndex = rows.findIndex(row => Number(row[0]) === Number(cartId));

      if (rowIndex === -1) return;

      const targetRow = rowIndex + 2;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `carts!E${targetRow}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[false]],
        },
      });
    },
  };
};
