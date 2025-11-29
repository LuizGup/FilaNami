import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children, role, routeImProtecting }) => {
  const { authenticated, loading, user, guiche } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não estiver autenticado (nem user, nem guichê)
  if (!authenticated) {
    // Rotas de Admin -> Vai pro login de Admin
    if (
      routeImProtecting === "/admin/historico-senhas" ||
      routeImProtecting === "/admin"
    ) {
      return <Navigate to="/login" />;
    }
    
    // Rotas Operacionais -> Vai pro login de Guichê
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

  // Validação de Roles Específicas
  if (role) {
    if (role === 'ADMIN') {
        // Para ADMIN, exige estritamente um usuario do tipo ADMIN
        if (!user || user.userType !== 'ADMIN') {
            return <Navigate to="/unauthorized" />; // Ou redireciona pro login
        }
    }

    if (role === 'DEFAULT_USER') {
        // Para rotas operacionais, aceitamos Guichê logado OU Usuário Default
        const isGuiche = !!guiche;
        const isDefaultUser = user && user.userType === 'DEFAULT_USER';
        
        if (!isGuiche && !isDefaultUser) {
             // Se o cara tá logado como ADMIN mas tentou entrar na rota de Guichê, 
             // talvez você queira deixar ou barrar. Aqui estou barrando se não for operacional.
             return <Navigate to="/login-guiche" />;
        }
    }
  }

  return children;
};