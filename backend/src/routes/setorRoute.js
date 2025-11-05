const express = require("express");
const {
  listSetores,
  getSetor,
  createSetor,
  updateSetor,
  deleteSetor,
} = require("../controllers/setorController");

const router = express.Router();

// GET /setores
router.get("/", listSetores);

// GET /setores/:id   (use ?includeGuiches=true para incluir relação)
router.get("/:id", getSetor);

// POST /setores      { setor }
router.post("/", createSetor);

// PATCH /setores/:id { setor? }
router.patch("/:id", updateSetor);

// DELETE /setores/:id
router.delete("/:id", deleteSetor);

module.exports = router;
