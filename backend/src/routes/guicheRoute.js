const express = require("express");
const router = express.Router();

const {
  getAllGuichesHandler,
  getGuicheByIdHandler,
  createGuicheHandler,
  updateGuicheHandler,
  deleteGuicheHandler,
} = require("../controllers/guicheController"); 

router.get("/", getAllGuichesHandler);
router.get("/:id", getGuicheByIdHandler);
router.post("/", createGuicheHandler);
router.put("/:id", updateGuicheHandler);
router.delete("/:id", deleteGuicheHandler);

module.exports = router;