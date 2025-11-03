const {
  getAllUsersModel,
  getUserByIdModel,
  createUserModel,
  updateUserModel,
  deleteUserModel,
} = require("../models/userModel");

const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsersModel();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

const getUserByIdHandler = async (req, res) => {
  const { id } = parseInt(req.params.id);
  try {
    const user = await getUserByIdModel(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } 
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

const createUserHandler = async (req, res) => {
  const { name, email, password, userType } = req.body;

  if (!name || !email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newUser = await createUserModel(name, email, password, userType);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

const updateUserHandler = async (req, res) => {
  const { id } = parseInt(req.params.id);
  const dataToUpdate = req.body;

  try {
    const updatedUser = await updateUserModel(id, dataToUpdate);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

const deleteUserHandler = async (req, res) => {
  const { id } = parseInt(req.params.id);
  try {
    await deleteUserModel(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler
};
