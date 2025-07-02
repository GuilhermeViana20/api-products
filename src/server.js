const express = require('express');
const { setupSheets } = require('./config/database');
const setupRoutes = require('./routes');
const cors = require('cors');

const app = express();
app.use(cors({ origin: ['http://192.168.1.134:5173', 'http://localhost:5173'] }));
app.use(express.json());

(async () => {
  const { sheets, spreadsheetId } = await setupSheets();
  const routes = await setupRoutes({ sheets, spreadsheetId });

  app.use(routes);
  app.listen(3000, () => console.log('API rodando em http://192.168.1.134:3000'));
})();
