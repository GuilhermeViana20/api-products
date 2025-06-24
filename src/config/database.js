const db = require('../models');

async function setupDatabase() {
  await db.sequelize.sync(); // ou migrations
  return { sequelize: db.sequelize, models: db };
}

module.exports = { setupDatabase };
