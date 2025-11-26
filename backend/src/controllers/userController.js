const {
  getAllUsers,
  getUserById,
  getUserProfileById,
  getUserByEmail,
  createUser,
  updateUserData,
  removeUser,
} = require("../services/userService");

const getAllUsersHandler = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve users" });
  }
};

const getUserByIdHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const user = await getUserById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user" });
  }
};

const getUserProfileByIdHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const userProfile = await getUserProfileById(id);
    if (!userProfile) {
      res.status(404).json({ error: "User profile not found" });
    }
    else {
      return res.status(200).json(userProfile);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user profile" });
  }
};

const getUserByEmailHandler = async (req, res) => {
  const email = req.params.email;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(404).json({ error: "User not found" });
    } else {
      return res.status(200).json(user);
    }
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
    const newUser = await createUser(name, email, password, userType);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

const updateUserHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  const dataToUpdate = req.body;

  try {
    const updatedUser = await updateUserData(id, dataToUpdate);
    if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

const deleteUserHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const success = await removeUser(id);
    if (!success) {
        return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsersHandler,
  getUserByIdHandler,
  getUserProfileByIdHandler,
  getUserByEmailHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler
};