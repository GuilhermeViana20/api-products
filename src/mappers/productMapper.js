const productMapper = (externalData, price = null) => {
  return {
    name: externalData.description,
    description: externalData.description,
    gtin: externalData.gtin,
    image: externalData.thumbnail,
    avg_price: externalData.avg_price !== null ? parseFloat(price) : 0.0,
    price: price !== null ? parseFloat(price) : 0.0,
    barcode_image: externalData.barcode_image,
  };
};

module.exports = { productMapper };