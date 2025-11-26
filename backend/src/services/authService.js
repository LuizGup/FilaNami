const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (email, password) => {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

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
  const existingUser = await prisma.usuario.findUnique({ where: { email } });
  
  if (existingUser) {
    throw new Error('E-mail já cadastrado.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.usuario.create({
    data: {
      name,
      email,
      password: hashedPassword,
      userType: userType || 'DEFAULT_USER',
    },
  });

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

module.exports = {
  login,
  register,
};