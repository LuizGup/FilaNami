const userDao = require("../repositories/userDao");

const getAllUsers = async () => {
  return await userDao.findAllUsers();
};

const getUserById = async (id) => {
  const user = await userDao.findUserById(id);
  return user;
};

const createUser = async (name, email, password, userType) => {
  return await userDao.createUser(name, email, password, userType);
};

const updateUser = async (id, dataToUpdate) => {
  const userExists = await userDao.findUserById(id);
  if (!userExists) return null;

  return await userDao.updateUser(id, dataToUpdate);
};

const deleteUser = async (id) => {
  const userExists = await userDao.findUserById(id);
  if (!userExists) return false;

  await userDao.deleteUser(id);
  return true;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};