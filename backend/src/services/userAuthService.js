const {
  selectUserByEmail, // MUDANÇA: Importar a função correta
  insertUser,
} = require("../repositories/userDao"); // Ajuste o caminho se necessário
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (email, password) => {
  // MUDANÇA: Usar selectUserByEmail em vez de selectUserById
  const usuario = await selectUserByEmail(email);

  if (!usuario) {
    throw new Error('Credenciais inválidas');
  }

  const isPasswordValid = await bcrypt.compare(password, usuario.password);

  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas');
  }

  const token = jwt.sign(
    { 
      id: usuario.id, 
      userType: usuario.userType 
    },
    process.env.JWT_SECRET || 'segredo_super_secreto',
    { expiresIn: '8h' }
  );

  return {
    token,
    user: {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      userType: usuario.userType,
    },
  };
};

const register = async (name, email, password, userType) => {
  // MUDANÇA: Aqui também deve ser selectUserByEmail para verificar duplicidade
  const existingUser = await selectUserByEmail(email);
  
  if (existingUser) {
    throw new Error('E-mail já cadastrado.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await insertUser(name, email, hashedPassword, userType || 'DEFAULT_USER');

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

module.exports = {
  login,
  register,
};