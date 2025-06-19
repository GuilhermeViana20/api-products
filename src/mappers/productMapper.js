const formatPrice = (value) => {
  return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
};

module.exports = (externalData, price = null) => {
  const resolvedAvgPrice = externalData.avg_price ?? '0.00';
  const resolvedPrice = (price || externalData.avg_price) ?? '0.00';

  return {
    name: externalData.description,
    description: externalData.description,
    gtin: externalData.gtin.toString(),
    image: externalData.thumbnail,
    avg_price: formatPrice(resolvedAvgPrice),
    price: formatPrice(resolvedPrice),
    barcode_image: externalData.barcode_image,
  };
};
