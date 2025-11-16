import api from "./api";

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || "filaNami_token";
const USER_KEY = import.meta.env.VITE_USER_KEY || "filaNami_user";

/**
 * Realiza o login do usuário usando o endpoint POST /api/users
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {object} Dados do usuário criado
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/users', {
      name: email.split('@')[0], // Usa parte do email como nome
      email,
      password,
      userType: 'DEFAULT_USER',
    });

    const user = response.data;

    // Armazena usuário no localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
};

/**
 * Faz logout do usuário
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Obtém o token armazenado
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Obtém os dados do usuário armazenado
 */
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = () => {
  return !!getUser();
};

/**
 * Configura o header de autorização no Axios
 */
export const setAuthorizationHeader = () => {
  const token = getToken();
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Configura o header ao importar o módulo
setAuthorizationHeader();
