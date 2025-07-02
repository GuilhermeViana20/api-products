// src/controllers/UserController.js
module.exports = (userService) => ({
  async create(req, res) {
    const data = req.body;

    try {
      const newUser = await userService.create(data);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  },

  async show(req, res) {
    const { id } = req.params;

    try {
      const user = await userService.find(id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  },

  async update(req, res) {
    const { id } = req.params;
    const data = req.body;

    try {
      const updatedUser = await userService.update(id, data);
      if (!updatedUser) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  },
});
