const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersHandler,
  getUserByIdHandler,
  getUserProfileByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler
} = require("../controllers/userController");


router.get("/", getAllUsersHandler);
router.get("/:id", authMiddleware, getUserByIdHandler);
router.get("/profile/:id", authMiddleware, getUserProfileByIdHandler);
router.post("/", createUserHandler);
router.put("/:id", updateUserHandler);
router.delete("/:id", deleteUserHandler);

module.exports = router;