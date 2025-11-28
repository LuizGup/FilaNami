import { useContext } from "react";
import { Navigate } from "react-router-dom"; // Assumindo react-router-dom v6
import { AuthContext } from "../contexts/AuthContext";

export const ProtectedRoute = ({ children, role }) => {
  const { authenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  
  if (role && user.userType !== role) {
     return <Navigate to="/unauthorized" />; 
  }

  return children;
};