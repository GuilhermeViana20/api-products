// src/services/UserService.js
module.exports = (userRepository) => ({
  async create(data) {
    return await userRepository.create(data);
  },

  async find(id) {
    return await userRepository.find(id);
  },

  async all() {
    return await userRepository.getAll();
  },

  async update(id, data) {
    return await userRepository.update(id, data);
  },
});
