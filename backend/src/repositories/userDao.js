const prisma = require("../prisma");
const bcrypt = require("bcryptjs");


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
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.Usuario.create({
    data: {
      name,
      email,
      password: hashedPassword,
      userType,
    },
  });
  return newUser;
};

const updateUser = async (id, dataToUpdate) => {
  if (dataToUpdate.password) {
    dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
  }

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