import api from "./api";

export const getAllGuiches = async () => {
    try {
        const response = await api.get("/guiches");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar guichês:", error);
        throw error;
    }
};

export const getGuicheById = async (id) => {
    try {
        const response = await api.get(`/guiches/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar guichê ${id}:`, error);
        throw error;
    }
};

export const createGuiche = async (guicheData) => {
    try {
        const response = await api.post("/guiches", guicheData);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar guichê:", error);
        throw error;
    }
};

export const updateGuiche = async (id, guicheData) => {
    try {
        const response = await api.put(`/guiches/${id}`, guicheData);
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar guichê ${id}:`, error);
        throw error;
    }
};

export const deleteGuiche = async (id) => {
    try {
        const response = await api.delete(`/guiches/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao deletar guichê ${id}:`, error);
        throw error;
    }
};

export const loginGuiche = async ({ idGuiche, senha }) => {
    try {
        const response = await api.post("/guiches/auth/login", {
            idGuiche,
            senha,
        });
        return response.data; // { idGuiche, numeroGuiche, idSetor, setor }
    } catch (error) {
        console.error("Erro ao fazer login do guichê:", error);
        throw error.response?.data || error;
    }
};
