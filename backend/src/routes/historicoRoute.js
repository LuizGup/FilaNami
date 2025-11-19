const express = require("express");
const router = express.Router();

const {
  getAllHistoricos,
  getHistoricoById,
  createHistorico,
  updateHistorico,
  deleteHistorico,
} = require("../controllers/historicoController");

// GET ALL
router.get("/", getAllHistoricos);

// GET BY ID
router.get("/:id", getHistoricoById);

// CREATE
router.post("/", createHistorico);

// UPDATE
router.put("/:id", updateHistorico);

// DELETE
router.delete("/:id", deleteHistorico);

module.exports = router;
