module.exports = (ProductModel) => ({
  create: (data) => ProductModel.create(data),

  findById: (id) => ProductModel.findByPk(id),

  findAll: () => ProductModel.findAll(),

  update: (id, data) =>
    ProductModel.update(data, {
      where: { id },
    }),

  delete: (id) => ProductModel.destroy({ where: { id } }),
});
