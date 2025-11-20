// controllers/historicoController.js
const historicoService = require("../services/historicoService");


// GET ALL
const getAllHistoricos = async (req, res) => {
  try {
    const historicos = await historicoService.getAllHistoricos();
    return res.status(200).json(historicos);
  } catch (error) {
    console.error("Erro ao buscar históricos:", error);
    const status = error.status || 500;
    const message = status === 500 ? "Erro interno ao buscar históricos." : error.message;
    return res.status(status).json({ error: message });
  }
};

// GET BY ID
const getHistoricoById = async (req, res) => {
  try {
    const { id } = req.params;
    const historico = await historicoService.getHistorico(Number(id));
    return res.status(200).json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico por ID:", error);
    const status = error.status || (error.code === "P2025" ? 404 : 500);
    const message =
      status === 500
        ? "Erro interno ao buscar histórico."
        : error.message || "Histórico não encontrado.";
    return res.status(status).json({ error: message });
  }
};

// CREATE
const createHistorico = async (req, res) => {
  try {
    const payload = req.body;
    const novoHistorico = await historicoService.createHistorico(payload);
    return res.status(201).json(novoHistorico);
  } catch (error) {
    console.error("Erro ao criar histórico:", error);
    const status = error.status || 500;
    const message = status === 500 ? "Erro interno ao criar histórico." : error.message;
    return res.status(status).json({ error: message });
  }
};

// UPDATE
const updateHistorico = async (req, res) => {
  try {
    const { id } = req.params;
    const dataToUpdate = req.body;
    const historicoAtualizado = await historicoService.updateHistorico(Number(id), dataToUpdate);
    return res.status(200).json(historicoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar histórico:", error);
    const status = error.status || (error.code === "P2025" ? 404 : 500);
    const message = status === 500 ? "Erro interno ao atualizar histórico." : error.message;
    return res.status(status).json({ error: message });
  }
};

// DELETE
const deleteHistorico = async (req, res) => {
  try {
    const { id } = req.params;
    await historicoService.deleteHistorico(Number(id));
    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar histórico:", error);
    const status = error.status || (error.code === "P2025" ? 404 : 500);
    const message = status === 500 ? "Erro interno ao deletar histórico." : error.message;
    return res.status(status).json({ error: message });
  }
};

module.exports = {
  getAllHistoricos,
  getHistoricoById,
  createHistorico,
  updateHistorico,
  deleteHistorico,
};
