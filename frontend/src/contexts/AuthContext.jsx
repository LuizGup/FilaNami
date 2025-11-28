import { createContext, useState, useEffect } from "react";
import { login as loginService, logout as logoutService } from "../services/userAuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
    console.log("Login bem-sucedido. Usuário recebido:", response.user);
    setUser(response.user);
    
    return response.user;
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

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