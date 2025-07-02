const { google } = require('googleapis');
const path = require('path');

async function setupSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../../api-products.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1h6IGIx9p1DKHAsXyTyNllocPgQYLpBM7YBrERi9PgVM';

  return { sheets, spreadsheetId };
}

module.exports = { setupSheets };
