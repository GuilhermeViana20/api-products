const { setupDatabase } = require('./database');

(async () => {
  const { sequelize } = await setupDatabase();
  await sequelize.sync({ force: true });
  console.log('Banco de dados recriado com sucesso!');
  process.exit();
})();
