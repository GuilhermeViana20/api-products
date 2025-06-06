module.exports = (userService) => ({
  store: async (req, res) => {
    try {
      const user = await userService.storeUser(req.body);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message, data: [], status: 400 });
    }
  },

  index: async (req, res) => {
    try {
      const users = await userService.listUsers();
      res.json(users);
    } catch (error) {
      res.status(400).json({ message: error.message, data: [], status: 400 });
    }
  },

  show: async (req, res) => {
    try {
      const user = await userService.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message, data: [], status: 400 });
    }
  },

  update: async (req, res) => {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.json({ message: 'Usuário atualizado com sucesso!', data: user, status: 200 });
    } catch (error) {
      res.status(400).json({ message: error.message, data: [], status: 400 });
    }
  },
});
