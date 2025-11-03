const prisma = require("../prisma");

const getAllUsersModel = async () => {
  const users = await prisma.User.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return users;
};

const getUserByIdModel = async (id) => {
  const user = await prisma.User.findUnique({
    where: {
      id: id,
    },
  });
  return user;
};

const createUserModel = async (name, email, password, userType) => {
  const newUser = await prisma.User.create({
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
  const updatedUser = await prisma.User.update({
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
  await prisma.User.delete({
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
