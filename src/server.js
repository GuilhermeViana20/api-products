const express = require('express');
const { setupDatabase } = require('./config/database');
const setupRoutes = require('./routes');
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://192.168.1.134:5173' }));
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

(async () => {
  const { sequelize, models } = await setupDatabase();
  const routes = await setupRoutes(models);

  app.use(routes);
  app.listen(3000, () => console.log('API rodando em http://192.168.1.134:3000'));
})();
