const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getLocalDateTime = require('../utils/getLocalDateTime');
const emailService = require('./EmailService');

const SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';
const CONFIRM_SECRET = process.env.CONFIRM_SECRET || 'chave_confirm_padrao';

module.exports = (userRepository, cartRepository) => ({
  async register(data) {
    if (!data.name || !data.email) throw new Error('Nome e e-mail são obrigatórios');

    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) throw new Error('Email já cadastrado');

    if (!data.password) throw new Error('Senha é obrigatória');

    const hashedPassword = await bcrypt.hash(String(data.password), 10);
    const now = getLocalDateTime();

    const userData = {
      ...data,
      password: hashedPassword,
      remember_token: '',
      email_verified_at: '',
      active: false,
      created_at: now,
      updated_at: now,
    };

    const user = await userRepository.create(userData);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      CONFIRM_SECRET,
      { expiresIn: '1d' }
    );

    const confirmUrl = `http://localhost:3000/api/users/confirm-email/${token}`;

    await emailService.sendEmail(user.email, 'Confirme seu email', `Clique aqui para confirmar: ${confirmUrl}`);

    return { message: 'Usuário registrado. Verifique seu email para ativar a conta.' };
  },

  async confirmUserEmail(token) {
    try {
      const decoded = jwt.verify(token, CONFIRM_SECRET);

      const user = await userRepository.find(decoded.id);
      if (!user) throw new Error('Usuário não encontrado');

      if (user.email_verified_at) {
        return { message: 'Email já foi confirmado anteriormente.' };
      }

      const now = getLocalDateTime();

      await userRepository.update(decoded.id, {
        email_verified_at: now,
        active: true,
        updated_at: now,
      });

      return { message: 'Email confirmado com sucesso!' };
    } catch {
      throw new Error('Token inválido ou expirado');
    }
  },

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Usuário não encontrado');

    if (!user.active) throw new Error('Usuário inativo. Confirme seu e-mail.');

    const cleanHash = user.password.replace(/\s/g, '');
    const valid = await bcrypt.compare(String(password), cleanHash);

    if (!valid) throw new Error('Senha inválida');

    const { password: _, ...userSafe } = user;

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: '1d' }
    );

    return { user: userSafe, token };
  },

  async find(id) {
    return userRepository.find(id);
  },

  async update(id, data) {
    const existingUser = await userRepository.find(id);
    if (!existingUser) throw new Error('Usuário não encontrado');

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const now = getLocalDateTime();

    const updatedData = {
      ...existingUser,
      ...data,
      updated_at: now,
    };

    return userRepository.update(id, updatedData);
  },
});
