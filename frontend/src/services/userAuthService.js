import api from "./api";

// Faz o login e salva os dados no localStorage
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    
    // O backend retorna { token, user }
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
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
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};