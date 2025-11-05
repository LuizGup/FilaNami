const prisma = require("../prisma");

const getAllUsersModel = async () => {
  const users = await prisma.Usuario.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return users;
};

const getUserByIdModel = async (id) => {
  const user = await prisma.Usuario.findUnique({
    where: {
      id: id,
    },
  });
  return user;
};

const createUserModel = async (name, email, password, userType) => {
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

const updateUserModel = async (id, dataToUpdate) => {
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

const deleteUserModel = async (id) => {
  await prisma.Usuario.delete({
    where: {
      id: id,
    },
  });
};

module.exports = {
  getAllUsersModel,
  getUserByIdModel,
  createUserModel,
  updateUserModel,
  deleteUserModel
};
