import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import SelectService from "./pages/Totem/EscolhaPrioridade";
import GerenciarSenhas from "./pages/Funcionario/GerenciarSenhas";
import SelectSector from "./pages/Totem/EscolhaSetor";
import Login from "./pages/Login/index";
import LoginGuiche from "./pages/LoginGuiche";
import HomePageAdmin from "./pages/Admin/HomePageAdmin";
import ShowKey from "./pages/Totem/MostrarSenha";
import HistoricoSenhas from "./pages/Admin/HistoricoSenhas";
import PainelSenhas from "./pages/PainelSenhas";
import HomePageEnfermeira from "./pages/Enfermeira/HomePageEnfermeira";
import GerenciarSenhasEnfermeira from "./pages/Enfermeira/GerenciarSenhas";
import HomeFuncionario from "./pages/Funcionario/HomeFuncionario";
import Telainicial from "./pages/TelaInicial";
import Gelado from "./pages/gelado";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login-guiche" element={<LoginGuiche />} />
          <Route path="/" element={<Telainicial />} />
          <Route path="/sign-up" element={<h1>Página de Registro</h1>} />
          <Route path="/tela-inicial" element={<Telainicial />} />

          <Route
            path="/user"
            element={
              <ProtectedRoute role="DEFAULT_USER" routeImProtecting="/user">
                <HomeFuncionario />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/gerenciar/:id"
            element={
              <ProtectedRoute role="DEFAULT_USER" routeImProtecting="/user/gerenciar/:id">
                <GerenciarSenhas />
              </ProtectedRoute>
            }
          />

          <Route
            path="/enfermeira"
            element={
              <ProtectedRoute role="DEFAULT_USER" routeImProtecting="/enfermeira">
                <HomePageEnfermeira />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enfermeira/gerenciar/:id"
            element={
              <ProtectedRoute
                role="DEFAULT_USER"
                routeImProtecting="/enfermeira/gerenciar/:id"
              >
                <GerenciarSenhasEnfermeira />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN" routeImProtecting="/admin">
                <HomePageAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/historico-senhas"
            element={
              <ProtectedRoute
                role="ADMIN"
                routeImProtecting="/admin/historico-senhas"
              >
                <HistoricoSenhas />
              </ProtectedRoute>
            }
          />

          <Route path="/toten" element={<SelectService />} />
          <Route path="/sector" element={<SelectSector />} />
          <Route path="/showkey" element={<ShowKey />} />
          <Route path="/painel" element={<PainelSenhas />} />
          <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
