import api from "./api";

export const createSenha = async (setorDestino, prioridade) => {
  try {
    const response = await api.post('/senhas', { setorDestino, prioridade });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar senha:", error);
    throw error;
  }
};

export const getAllSenhas = async (filters = {}) => {
  try {
    const response = await api.get('/senhas', { params: filters });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar senhas:", error);
    throw error;
  }
};

export const getSenhaById = async (id) => {
  try {
    const response = await api.get(`/senhas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar senha ${id}:`, error);
    throw error;
  }
};

export const chamarProximaSenha = async (idGuiche, setor) => {
  try {
      const response = await api.post('/senhas/chamar', { 
      idGuiche, 
      setor 
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao chamar próxima senha:", error);
    throw error;
  }
};

export const concluirSenha = async (id) => {
  try {
    const response = await api.put(`/senhas/${id}`, {});
    return response.data;
  } catch (error) {
    console.error(`Erro ao concluir senha ${id}:`, error);
    throw error;
  }
};

export const deleteSenha = async (id) => {
  try {
    const response = await api.delete(`/senhas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar senha ${id}:`, error);
    throw error;
  }
};