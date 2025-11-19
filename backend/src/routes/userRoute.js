const express = require("express");
const router = express.Router();

const {
  getAllUsersHandler,
  getUserByIdHandler,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler
} = require("../controllers/userController");

router.get("/", getAllUsersHandler);
router.get("/:id", getUserByIdHandler);
router.post("/", createUserHandler);
router.put("/:id", updateUserHandler);
router.delete("/:id", deleteUserHandler);

module.exports = router;