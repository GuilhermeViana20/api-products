// src/repositories/CartRepository.js
module.exports = (sheets, spreadsheetId, userRepository) => {
  const range = 'carts!A2:H';
  const getLocalDateTime = require('../utils/getLocalDateTime');

  async function getAllRows() {
    const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    return response.data.values || [];
  }

  return {
    async index(user_id) {
      const rows = await getAllRows();
      const user = await userRepository.find(user_id);

      return rows
        .map((row) => row[7] === user_id.toString() ? mapRow(row, user) : null)
        .filter(Boolean);
    },

    async getByUserId(user_id) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });

      const rows = response.data.values || [];

      const carts = await Promise.all(rows.map(async (row, index) => {
        try {
          const rowUserId = row[7];
          if (rowUserId !== user_id.toString()) return null;

          return {
            id: Number(row[0]),
            store_name: row[1],
            total: parseFloat(row[2]) || 0,
            quantity: Number(row[3]),
            is_active: row[4],
            created_at: row[5],
            updated_at: row[6],
            user: await userRepository.find(user_id),
            description: `Carrinho de ${row[1]}`,
          };
        } catch (error) {
          console.error(`Erro ao processar linha ${index + 2}:`, error.message);
          return null;
        }
      }));

      return carts.filter(c => c !== null);
    },

    async create(cartData) {
      const id = await this.lastItem();
      const now = getLocalDateTime();

      const { store_name, total, quantity, user_id } = cartData;

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [[
            id.toString(),
            store_name,
            total.toString(),
            quantity.toString(),
            true,
            now,
            now,
            user_id.toString()
          ]],
        },
      });
    },

    async lastItem() {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'carts!A2:A',
      });

      const values = response.data.values || [];

      if (values.length === 0) return 1;

      const ids = values
        .map((row) => parseInt(row[0]))
        .filter((id) => !isNaN(id));

      return Math.max(...ids, 0) + 1;
    },

    async deactivate(cartId) {
      const rows = await getAllRows();
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

    async update(cartId, data) {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range
      });

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
  };
};
