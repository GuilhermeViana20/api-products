// src/controllers/UserController.js
module.exports = (userService) => ({
  async register(req, res) {
    try {
      const newUser = await userService.register(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await userService.login(email, password);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: error.message });
    }
  },

  async confirmEmail(req, res) {
    try {
      const result = await userService.confirmUserEmail(req.params.token);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async show(req, res) {
    try {
      const user = await userService.find(req.params.id);
      if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  },

  async update(req, res) {
    try {
      const updatedUser = await userService.update(req.params.id, req.body);
      if (!updatedUser) return res.status(404).json({ error: 'Usuário não encontrado' });
      res.json({
        'message': 'Usuário atualizado com sucesso',
        'user': updatedUser
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  },
});