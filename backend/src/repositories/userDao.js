const prisma = require("../prisma");

const findAllUsers = async () => {
  const users = await prisma.Usuario.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return users;
};

const findUserById = async (id) => {
  const user = await prisma.Usuario.findUnique({
    where: {
      id: id,
    },
  });
  return user;
};

const createUser = async (name, email, password, userType) => {
  const newUser = await prisma.Usuario.create({
    data: {
      name,
      email,
      password,
      userType,
    },
  });
  return newUser;
};

const updateUser = async (id, dataToUpdate) => {
  const updatedUser = await prisma.Usuario.update({
    where: {
      id: id,
    },
    data: {
      ...dataToUpdate,
    },
  });
  return updatedUser;
};

const deleteUser = async (id) => {
  await prisma.Usuario.delete({
    where: {
      id: id,
    },
  });
};

module.exports = {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser
};