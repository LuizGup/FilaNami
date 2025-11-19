const {
  selectAllUsers,
  selectUserById,
  insertUser,
  updateUser,
  deleteUser,
} = require("../repositories/userDao");

const getAllUsers = async (req, res) => {
  try {
    const users = await selectAllUsers(); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await selectUserById(id); 
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

const insertUser = async (req, res) => {
  const { name, email, password, userType } = req.body;

  if (!name || !email || !password || !userType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newUser = await insertUser(name, email, password, userType); 
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const dataToUpdate = req.body;

  try {
    const updatedUser = await updateUser(id, dataToUpdate);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await deleteUser(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  insertUser,
  updateUser,
  deleteUser
};