const express = require("express");
const {
  listSetoresHandler,
  getSetorHandler,
  createSetorHandler,
  updateSetorHandler,
  deleteSetorHandler,
} = require("../controllers/setorController");

const router = express.Router();

// GET /setores
router.get("/", listSetoresHandler);

// GET /setores/:id   (use ?includeGuiches=true para incluir relação)
router.get("/:id", getSetorHandler);

// POST /setores      { setor }
router.post("/", createSetorHandler);

// PATCH /setores/:id { setor? }
router.patch("/:id", updateSetorHandler);

// DELETE /setores/:id
router.delete("/:id", deleteSetorHandler);

module.exports = router;
