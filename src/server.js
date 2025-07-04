const express = require('express');
const { setupSheets } = require('./config/database');
const setupRoutes = require('./routes');
const cors = require('cors');

const app = express();
app.use(cors({ origin: ['http://172.30.228.62:5173', 'http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());

(async () => {
  const { sheets, spreadsheetId } = await setupSheets();
  const routes = await setupRoutes({ sheets, spreadsheetId });

  app.use(routes);
  app.listen(3000, () => console.log('API rodando em http://172.30.228.62:3000'));
})();
