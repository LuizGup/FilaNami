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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login-guiche" element={<LoginGuiche />} />
          <Route path="/" element={<Telainicial />} />
          <Route path="/sign-up" element={<h1>Página de Registro</h1>} />
          <Route path="/user" element={<h1>Página do Funcionario</h1>} />
          {/* Rotas Protegidas */}
          <Route
            path="/user/gerenciar"
            element={
              <ProtectedRoute>
                <GerenciarSenhas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/enfermeira/gerenciar"
            element={
              <ProtectedRoute>
                <GerenciarSenhasEnfermeira />
              </ProtectedRoute>
            }
          />
          <Route path="/enfermeira" element={<HomePageEnfermeira />} />
          <Route path="/home-funcionario-senhas" element={<HomeFuncionario />} />
          <Route path="/toten" element={<SelectService />} />
          <Route path="/sector" element={<SelectSector />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <HomePageAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="/painel" element={<PainelSenhas />} />
          <Route path="/tela-inicial" element={<Telainicial />} />
          <Route
            path="/admin/historico-senhas"
            element={
              <ProtectedRoute>
                <HistoricoSenhas />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
          <Route path="/showkey" element={<ShowKey />} />
          <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
