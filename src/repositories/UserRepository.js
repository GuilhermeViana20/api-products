// src/repositories/UserRepository.js
const userMapper = {
  fromSheetRow(row) {
    return {
      id: Number(row[0]),
      name: row[1],
      email: row[2],
      phone: row[3],
      created_at: row[4],
      updated_at: row[5],
    };
  }
};

module.exports = (sheets, spreadsheetId) => {
  const repository = {
    async getLastId() {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'users!A2:A',
      });

      const values = response.data.values || [];

      if (values.length === 0) return 1;

      const ids = values
        .map(row => parseInt(row[0]))
        .filter(id => !isNaN(id));

      const lastId = Math.max(...ids, 0);

      return lastId + 1;
    },

    async create(userData) {
      const id = await repository.getLastId();
      const now = new Date().toISOString();

      const newUser = [
        id, // número sem aspas
        userData.name || '',
        userData.email || '',
        userData.phone || '',
        now,
        now
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'users!A2:F',
        valueInputOption: 'USER_ENTERED', // para interpretar tipo corretamente
        insertDataOption: 'INSERT_ROWS',
        resource: { values: [newUser] },
      });

      return {
        id,
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || ''
      };
    },

    async find(id) {
      const users = await this.getAll();
      return users.find(user => user.id === Number(id)) || null;
    },

    async getAll() {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'users!A2:F',
      });

      const rows = response.data.values || [];
      return rows.map(userMapper.fromSheetRow);
    },

    async update(id, data) {
      const now = new Date().toISOString();

      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'users!A2:F',
      });

      const rows = response.data.values || [];

      const rowIndex = rows.findIndex(row => Number(row[0]) === Number(id));
      if (rowIndex === -1) return null;

      const updatedRow = [
        Number(id),
        data.name || rows[rowIndex][1],
        data.email || rows[rowIndex][2],
        data.phone || rows[rowIndex][3],
        rows[rowIndex][4],
        now
      ];

      const targetRow = rowIndex + 2;

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `users!A${targetRow}:F${targetRow}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [updatedRow],
        },
      });

      return userMapper.fromSheetRow(updatedRow);
    },
  };

  return repository;
};
