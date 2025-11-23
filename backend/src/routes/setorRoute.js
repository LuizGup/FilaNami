const express = require("express");
const {
  getAllSetoresHandler,
  getSetorByIdHandler,
  createSetorHandler,
  updateSetorHandler,
  deleteSetorHandler,
} = require("../controllers/setorController");

const router = express.Router();

router.get("/", getAllSetoresHandler);
router.get("/:id", getSetorByIdHandler);
router.post("/", createSetorHandler);
router.put("/:id", updateSetorHandler);
router.delete("/:id", deleteSetorHandler);
module.exports = router;
