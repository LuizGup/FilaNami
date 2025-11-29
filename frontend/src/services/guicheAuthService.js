import api from "./api";

const GUICHE_TOKEN_KEY = "guiche_token";
const GUICHE_INFO_KEY = "guiche_info";

export const loginGuiche = async (idGuiche, senha) => {
    try {
        const response = await api.post("/guiches/auth/login", {
            idGuiche,
            senha,
        });

        const { token, guiche } = response.data || {};

        if (token) {
            localStorage.setItem(GUICHE_TOKEN_KEY, token);
            localStorage.setItem(GUICHE_INFO_KEY, JSON.stringify(guiche));
        }

        return { token, guiche };
    } catch (error) {
        console.error("Erro no login do guichê (front):", error);
        throw error;
    }
};

export const getGuicheLogado = () => {
    const raw = localStorage.getItem(GUICHE_INFO_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        localStorage.removeItem(GUICHE_INFO_KEY);
        return null;
    }
};

export const logoutGuiche = () => {
    localStorage.removeItem(GUICHE_TOKEN_KEY);
    localStorage.removeItem(GUICHE_INFO_KEY);
};
