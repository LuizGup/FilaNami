// src/services/historicoService.js
const {
  selectAllHistoricos,
  selectHistoricoById,
  selectAllSenhasHistorico, 
  insertHistorico,
  updateHistorico,
  deleteHistorico,
} = require("../repositories/historicoDao");


const getAllHistoricos = async () => {
  return await selectAllHistoricos();
};

// FUNÇÃO ADICIONADA
const getAllSenhasHistorico = async () => {
  return await selectAllSenhasHistorico();
};

const getHistorico = async (id) => {
  if (id === undefined || id === null || Number.isNaN(Number(id))) {
    const err = new Error("ID inválido para buscar histórico.");
    err.status = 400;
    throw err;
  }

  const historico = await selectHistoricoById(Number(id));

  if (!historico) {
    const err = new Error("Histórico não encontrado.");
    err.status = 404;
    throw err;
  }

  return historico;
};

const createHistorico = async ({ idGuiche, idSenha, ...rest }) => {
  if (!idGuiche || !idSenha) {
    const err = new Error("idGuiche e idSenha são obrigatórios.");
    err.status = 400;
    throw err;
  }

  const payload = {
    idGuiche: Number(idGuiche),
    idSenha: Number(idSenha),
    ...rest,
  };

  const novo = await insertHistorico(payload);
  return novo;
};

const updateHistoricoService = async (id, dataToUpdate) => {
  if (id === undefined || id === null || Number.isNaN(Number(id))) {
    const err = new Error("ID inválido para atualização.");
    err.status = 400;
    throw err;
  }

  if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
    const err = new Error("Nenhum dado fornecido para atualização.");
    err.status = 400;
    throw err;
  }

  try {
    const atualizado = await updateHistorico(Number(id), dataToUpdate);
    return atualizado;
  } catch (error) {
    if (error && error.code) throw error;
    const err = new Error("Erro ao atualizar histórico.");
    err.cause = error;
    throw err;
  }
};

const deleteHistoricoService = async (id) => {
  if (id === undefined || id === null || Number.isNaN(Number(id))) {
    const err = new Error("ID inválido para exclusão.");
    err.status = 400;
    throw err;
  }

  try {
    await deleteHistorico(Number(id));
    return true;
  } catch (error) {
    if (error && error.code) throw error;
    const err = new Error("Erro ao deletar histórico.");
    err.cause = error;
    throw err;
  }
};

module.exports = {
  getAllHistoricos,
  getAllSenhasHistorico, // <--- ADICIONADO
  getHistorico,
  createHistorico,
  updateHistorico: updateHistoricoService,
  deleteHistorico: deleteHistoricoService,
};