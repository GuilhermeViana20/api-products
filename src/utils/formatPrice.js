const formatPrice = (value) => {
  return `R$ ${parseFloat(value).toFixed(2).replace('.', ',')}`;
};

module.exports = formatPrice;
