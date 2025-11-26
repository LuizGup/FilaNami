import { createContext, useState, useEffect } from "react";
import { login as loginService, logout as logoutService } from "../services/userAuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ao carregar a página, verifica se já tem usuário salvo
  useEffect(() => {
    const recoveredUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (recoveredUser && token) {
      setUser(JSON.parse(recoveredUser));
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await loginService(email, password);
    // Atualiza o estado global com o usuário retornado pelo backend
    setUser(response.user);
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  // Verifica se o usuário tem permissão (ex: ADMIN vs DEFAULT_USER)
  // Útil para proteger rotas específicas
  const userHasPermission = (requiredRole) => {
    if (!user) return false;
    if (!requiredRole) return true;
    return user.userType === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ authenticated: !!user, user, login, logout, loading, userHasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};