import { useContext } from "react";
import { Navigate } from "react-router-dom"; // Assumindo react-router-dom v6
import { AuthContext } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children, role, routeImProtecting }) => {
  const { authenticated, loading, user } = useContext(AuthContext);

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

  if (role && user.userType !== role) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};
