import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
});

// Interceptor para adicionar o Token em toda requisição
api.interceptors.request.use((config) => {
  // Tenta pegar o token do localStorage
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;