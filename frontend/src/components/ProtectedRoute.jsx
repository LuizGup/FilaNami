import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children, role, routeImProtecting }) => {
  const { authenticated, loading, user, guiche } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!authenticated) {
    if (
      routeImProtecting === "/admin/historico-senhas" ||
      routeImProtecting === "/admin"
    ) {
      return <Navigate to="/login" />;
    }
    
    if (
      routeImProtecting === "/user/gerenciar" ||
      routeImProtecting === "/enfermeira/gerenciar" ||
      routeImProtecting === "/user" ||
      routeImProtecting === "/enfermeira"
    ) {
      return <Navigate to="/login-guiche" />;
    }

    return <Navigate to="/tela-inicial" />;
  }

  if (role) {
    if (role === 'ADMIN') {
        if (!user || user.userType !== 'ADMIN') {
            return <Navigate to="/unauthorized" />; // Ou redireciona pro login
        }
    }

    if (role === 'DEFAULT_USER') {
        const isGuiche = !!guiche;
        const isDefaultUser = user && user.userType === 'DEFAULT_USER';
        
        if (!isGuiche && !isDefaultUser) {
             return <Navigate to="/login-guiche" />;
        }
    }
  }

  return children;
};