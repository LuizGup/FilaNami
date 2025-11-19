const {
  selectAllUsers,
  selectUserById,
  insertUser,
  updateUser,
  deleteUser
} = require("../repositories/userDao");

const getAllUsers = async () => {
  return await selectAllUsers();
};

const getUserById = async (id) => {
  const user = await selectUserById(id);
  return user;
};

const createUser = async (name, email, password, userType) => {
  return await insertUser(name, email, password, userType);
};

const updateUserData = async (id, dataToUpdate) => {
  const userExists = await selectUserById(id);
  if (!userExists) return null;

  return await updateUser(id, dataToUpdate);
};

const removeUser = async (id) => {
  const userExists = await selectUserById(id);
  if (!userExists) return false;

  await deleteUser(id);
  return true;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserData,
  removeUser,
};