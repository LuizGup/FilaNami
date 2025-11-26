const express = require("express");
const router = express.Router();

const {
  getAllHistoricosHandler,
  getAllSenhasHistoricoHandler, // <--- ADICIONADO
  getHistoricoByIdHandler,
  createHistoricoHandler,
  updateHistoricoHandler,
  deleteHistoricoHandler,
} = require("../controllers/historicoController");

router.get("/senhas", getAllSenhasHistoricoHandler); // <--- ROTA ADICIONADA
router.get("/", getAllHistoricosHandler);
router.get("/:id", getHistoricoByIdHandler);
router.post("/", createHistoricoHandler);
router.put("/:id", updateHistoricoHandler);
router.delete("/:id", deleteHistoricoHandler);

module.exports = router;
