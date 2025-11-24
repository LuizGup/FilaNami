import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SelectService from "./pages/Totem/EscolhaPrioridade";
import GerenciarSenhas from "./pages/Funcionario/GerenciarSenhas";
import SelectSector from "./pages/Totem/EscolhaSetor";
import Login from "./pages/Login/index";
import HomePageAdmin from "./pages/HomePageAdmin";
import ShowKey from "./pages/Totem/MostrarSenha";
import HistoricoSenhas from "./pages/Admin/HistoricoSenhas";
import PainelSenhas from "./pages/PainelSenhas";
import HomePageEnfermeira from "./pages/Enfermeira/HomePageEnfermeira";
import GerenciarSenhasEnfermeira from "./pages/Enfermeira/GerenciarSenhas";
import Telainicial from "./pages/TelaInicial";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Telainicial />} />
        <Route path="/sign-up" element={<h1>Página de Registro</h1>} />
        <Route path="/user" element={<h1>Página do Funcionario</h1>} />
        <Route path="/user/gerenciar" element={<GerenciarSenhas />} />
        <Route path="/enfermeira" element={<HomePageEnfermeira />} />
        <Route path="/enfermeira/GerenciarSenhas" element={<GerenciarSenhasEnfermeira />} />
        <Route path="/toten" element={<SelectService />} />
        <Route path="/sector" element={<SelectSector />} />
        <Route path="/admin" element={<HomePageAdmin />} /> 
        <Route path="/painel" element={<PainelSenhas />} />
        <Route path="/telaInicial" element={<Telainicial />} />
        <Route path="/admin/historicoSenhas" element={<HistoricoSenhas/>} />
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
        <Route path="/showkey" element={<ShowKey />} />
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
