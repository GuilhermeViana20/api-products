const express = require('express');
const { setupDatabase } = require('./config/database');
const setupRoutes = require('./routes');

const app = express();
app.use(express.json());

(async () => {
  const { sequelize, models } = await setupDatabase();
  const routes = await setupRoutes(models);

  app.use(routes);
  app.listen(3000, () => console.log('API rodando em http://localhost:3000'));
})();
