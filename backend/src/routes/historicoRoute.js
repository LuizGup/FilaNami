const express = require("express");
const router = express.Router();

const {
  getAllHistoricosHandler,
  getHistoricoByIdHandler,
  createHistoricoHandler,
  updateHistoricoHandler,    
  deleteHistoricoHandler,    
} = require("../controllers/historicoController");

router.get("/", getAllHistoricosHandler);
router.get("/:id", getHistoricoByIdHandler);
router.post("/", createHistoricoHandler);
router.put("/:id", updateHistoricoHandler);
router.delete("/:id", deleteHistoricoHandler);

module.exports = router;
