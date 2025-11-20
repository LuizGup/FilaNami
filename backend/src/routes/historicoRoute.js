const express = require("express");
const router = express.Router();

const {
  getAllHistoricos,
  getHistoricoById,
  createHistorico,
  updateHistoricoHandler,
  deleteHistoricoHandler,
} = require("../controllers/historicoController");

// GET ALL
router.get("/", getAllHistoricos);

// GET BY ID
router.get("/:id", getHistoricoById);

// CREATE
router.post("/", createHistorico);

// UPDATE
router.put("/:id", updateHistoricoHandler);

// DELETE
router.delete("/:id", deleteHistoricoHandler);

module.exports = router;
