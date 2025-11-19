const prisma = require("../prisma");

const selectAllUsers = async () => {
  const users = await prisma.Usuario.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return users;
};

const selectUserById = async (id) => {
  const user = await prisma.Usuario.findUnique({
    where: {
      id: id,
    },
  });
  return user;
};

const insertUser = async (name, email, password, userType) => {
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
  selectAllUsers,
  selectUserById,
  insertUser,
  updateUser,
  deleteUser
};