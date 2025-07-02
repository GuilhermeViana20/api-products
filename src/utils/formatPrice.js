const formatPrice = (value) => {
  const number = parseFloat(value);
  if (isNaN(number)) return 'R$ 0,00';
  return `R$ ${number.toFixed(2).replace('.', ',')}`;
};

module.exports = formatPrice;