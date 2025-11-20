const express = require("express");
const {
  listSetoresHandler,
  getSetorHandler,
  createSetorHandler,
  updateSetorHandler,
  deleteSetorHandler,
} = require("../controllers/setorController");

const router = express.Router();

router.get("/", listSetoresHandler);
router.get("/:id", getSetorHandler);
router.post("/", createSetorHandler);
router.patch("/:id", updateSetorHandler);
router.delete("/:id", deleteSetorHandler);
module.exports = router;
