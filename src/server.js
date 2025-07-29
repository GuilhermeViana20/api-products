const express = require('express');
const { setupSheets } = require('./config/database');
const setupRoutes = require('./routes');
const cors = require('cors');

const app = express();
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

(async () => {
  const { sheets, spreadsheetId } = await setupSheets();
  const routes = await setupRoutes({ sheets, spreadsheetId });

  app.use('/api', routes);
})();

module.exports = app;