module.exports = (UserModel) => ({
  create: (data) => UserModel.create(data),
  findById: (id) => UserModel.findByPk(id),
  getAll: () => UserModel.findAll(),
  delete: (id) => UserModel.destroy({ where: { id } }),
  update: (id, data) => UserModel.update(data, { where: { id } }),
});
