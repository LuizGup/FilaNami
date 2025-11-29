import api from "./api";

const USER_TOKEN_KEY = "user_token";
const USER_INFO_KEY = "user_info";

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    
    if (response.data.token) {
      localStorage.setItem(USER_TOKEN_KEY, response.data.token);
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.error("Erro no registro:", error);
    throw error;
  }
};

export const logout = () => {

  localStorage.removeItem(USER_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
};