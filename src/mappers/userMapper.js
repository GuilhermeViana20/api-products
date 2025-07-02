module.exports = {
  fromSheetRow: (row) => ({
    id: row[0],
    name: row[1],
    email: row[2],
    phone: row[3],
    created_at: row[4],
    updated_at: row[5]
  }),

  fromSheetRows: (rows) => rows.map((row) => module.exports.fromSheetRow(row)),
};
