import api from "./api";


/**
 * Busca todas as senhas.
 * Rota: GET /api/senhas
 */
export const getAllSenhas = async () => {
  try {
    const response = await api.get('/senhas');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar senhas:", error);
    throw error;
  }
};

/**
 * Chama a próxima senha da fila.
 * Rota: POST /api/senhas/chamar
 */
export const chamarProximaSenha = async () => {
  try {
    // O backend 'callNext' deve encontrar a próxima senha e movê-la
    // para "EM_ATENDIMENTO", retornando a senha que foi chamada.
    const response = await api.post('/senhas/chamar');
    return response.data;
  } catch (error) {
    console.error("Erro ao chamar próxima senha:", error);
    throw error;
  }
};

/**
 * Conclui o atendimento de uma senha.
 * Rota: PUT /api/senhas/:id/concluir
 * @param {number} id O ID da senha a ser concluída.
 */
export const concluirSenha = async (id) => {
  try {
    const response = await api.put(`/senhas/${id}/concluir`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao concluir senha ${id}:`, error);
    throw error;
  }
};