const { Op } = require("sequelize");

// repositories/ProductRepository.js
module.exports = (Product) => ({
  create: (data) => Product.create(data),

  search: async (query) => {
    const stringQuery = query.toString();

    return await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${stringQuery}%` } },
          { gtin: { [Op.like]: `%${stringQuery}%` } }
        ]
      }
    });
  },

  findById: async (id) => {
    return await Product.findByPk(id);
  },

  find: (gtin) => Product.findOne({ where: { gtin: gtin } }),

  findAll: () => Product.findAll(),

  update: (id, data) => Product.update(data, { where: { id } }),

  delete: (id) => Product.destroy({ where: { id } }),
});
