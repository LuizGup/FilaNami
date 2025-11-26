import api from "./api";

export const getAllHistoricos = async () => {
  try {
    const response = await api.get('/historico'); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar históricos:", error);
    throw error;
  }
};

export const getHistoricoById = async (id) => {
  try {
    const response = await api.get(`/historico/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar histórico ${id}:`, error);
    throw error;
  }
};

export const createHistorico = async (historicoData) => {
  try {
    const response = await api.post('/historico', historicoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar histórico:", error);
    throw error;
  }
};

export const updateHistorico = async (id, historicoData) => {
  try {
    const response = await api.put(`/historico/${id}`, historicoData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar histórico ${id}:`, error);
    throw error;
  }
};

export const deleteHistorico = async (id) => {
  try {
    const response = await api.delete(`/historico/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar histórico ${id}:`, error);
    throw error;
  }
};

export const getAllSenhasHistorico = async () => { 
  try {
    const response = await api.get('/historico/senhas'); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar senhas do histórico:", error);
    throw error;
  }
};