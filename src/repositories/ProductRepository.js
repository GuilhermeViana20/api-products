// repositories/ProductRepository.js
module.exports = (ProductModel) => ({
  create: (data) => ProductModel.create(data),

  findById: async (id) => {
    return await ProductModel.findByPk(id);
  },

  find: (gtin) => ProductModel.findOne({ where: { gtin: gtin.toString() } }),

  findAll: () => ProductModel.findAll(),

  update: (id, data) => ProductModel.update(data, { where: { id } }),

  delete: (id) => ProductModel.destroy({ where: { id } }),
});
