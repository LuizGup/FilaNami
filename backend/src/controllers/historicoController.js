const {
  selectAllHistoricos,
  selectHistoricoById,
  insertHistorico,
  updateHistorico,
  deleteHistorico
} = require("../repositories/historicoDao");

// GET ALL
const getAllHistoricos = async (req, res) => {
  try {
    const historicos = await selectAllHistoricos();
    return res.status(200).json(historicos);
  } catch (error) {
    console.error("Erro ao buscar históricos:", error);
    return res.status(500).json({ error: "Erro interno ao buscar históricos." });
  }
};

// GET BY ID
const getHistoricoById = async (req, res) => {
  try {
    const { id } = req.params;
    const historico = await selectHistoricoById(Number(id));

    if (!historico) {
      return res.status(404).json({ error: "Histórico não encontrado." });
    }

    return res.status(200).json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico por ID:", error);
    return res.status(500).json({ error: "Erro interno ao buscar histórico." });
  }
};

// CREATE
const createHistorico = async (req, res) => {
  try {
    const { idGuiche, idSenha } = req.body;

    if (!idGuiche || !idSenha) {
      return res.status(400).json({ error: "idGuiche e idSenha são obrigatórios." });
    }

    const novoHistorico = await insertHistorico(idGuiche, idSenha);
    return res.status(201).json(novoHistorico);
  } catch (error) {
    console.error("Erro ao criar histórico:", error);
    return res.status(500).json({ error: "Erro interno ao criar histórico." });
  }
};

// UPDATE
const updateHistoricoHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const dataToUpdate = req.body;

    const historicoAtualizado = await updateHistorico(Number(id), dataToUpdate);
    return res.status(200).json(historicoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar histórico:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Histórico não encontrado para atualização." });
    }

    return res.status(500).json({ error: "Erro interno ao atualizar histórico." });
  }
};

// DELETE
const deleteHistoricoHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteHistorico(Number(id));

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao deletar histórico:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ error: "Histórico não encontrado para exclusão." });
    }

    return res.status(500).json({ error: "Erro interno ao deletar histórico." });
  }
};

module.exports = {
  getAllHistoricos,
  getHistoricoById,
  createHistorico,
  updateHistoricoHandler,
  deleteHistoricoHandler,
};
