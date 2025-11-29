import { createContext, useState, useEffect } from "react";
import { login as loginService, logout as logoutService } from "../services/userAuthService";
import { 
  loginGuiche as loginGuicheService, 
  logoutGuiche as logoutGuicheService, 
  getGuicheLogado 
} from "../services/guicheAuthService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [guiche, setGuiche] = useState(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recoveredUser = localStorage.getItem("user");
    const tokenUser = localStorage.getItem("token");

    if (recoveredUser && tokenUser) {
      setUser(JSON.parse(recoveredUser));
    }

    const recoveredGuiche = getGuicheLogado();
    const tokenGuiche = localStorage.getItem("guiche_token");

    if (recoveredGuiche && tokenGuiche) {
      setGuiche(recoveredGuiche);
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await loginService(email, password);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  const loginGuiche = async (idGuiche, senha) => {
    const response = await loginGuicheService(idGuiche, senha);
    
    setGuiche(response.guiche);

    console.log("🟢 [AuthContext] Guichê logado com sucesso:", response);

    return response;
  };

  const logoutGuicheSession = () => {
    logoutGuicheService();
    setGuiche(null);
  };

  const userHasPermission = (requiredRole) => {
    if (requiredRole === 'ADMIN') {
        return user && user.userType === 'ADMIN';
    }

    if (requiredRole === 'DEFAULT_USER') {
        const isUserDefault = user && user.userType === 'DEFAULT_USER';
        const isGuiche = !!guiche;
        return isUserDefault || isGuiche;
    }

    return true;
  };

  return (
    <AuthContext.Provider value={{ 
        authenticated: !!user || !!guiche, 
        user, 
        guiche, 
        loading, 
        login, 
        logout,
        loginGuiche,        
        logoutGuicheSession,
        userHasPermission 
    }}>
      {children}
    </AuthContext.Provider>
  );
};