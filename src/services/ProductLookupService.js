const axios = require('axios');
require('dotenv').config();

const API_URL = process.env.COSMOS_API_URL;
const API_TOKEN = process.env.COSMOS_TOKEN;

async function getProductByBarcode(barcode) {
  try {
    const response = await axios.get(`${API_URL}${barcode}`, {
      headers: {
        'X-Cosmos-Token': API_TOKEN
      }
    });
    return response.data;
  } catch (error) {
    console.log(error)
    return null;
  }
}

module.exports = { getProductByBarcode };
