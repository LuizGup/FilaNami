import api from "./api";

// chave usada no localStorage só para o guichê logado
const GUICHE_STORAGE_KEY = "guicheLogado";

// Faz o login do guichê e salva os dados no localStorage
export const loginGuiche = async (idGuiche, senha) => {
    try {
        const response = await api.post("/guiches/auth/login", { idGuiche, senha });
        // backend retorna: { idGuiche, numeroGuiche, idSetor, setor }

        if (response.data) {
            localStorage.setItem(
                GUICHE_STORAGE_KEY,
                JSON.stringify(response.data)
            );
        }

        return response.data;
    } catch (error) {
        console.error("Erro no login do guichê:", error);
        // mantém o padrão do userAuthService: repassar o erro pra tela tratar
        throw error;
    }
};

// Recupera o guichê logado do localStorage
export const getGuicheLogado = () => {
    const raw = localStorage.getItem(GUICHE_STORAGE_KEY);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch {
        // se der ruim no parse, limpa o storage pra não ficar lixo
        localStorage.removeItem(GUICHE_STORAGE_KEY);
        return null;
    }
};

// Faz logout do guichê
export const logoutGuiche = () => {
    localStorage.removeItem(GUICHE_STORAGE_KEY);
};
