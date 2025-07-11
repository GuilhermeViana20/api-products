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
  const PORT = process.env.PORT || 3000;

  app.use('/api', routes);

  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}/api`);
  });
})();
