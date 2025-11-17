import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectService from "./pages/Totem/EscolhaPrioridade/SelectService";
import GerenciarSenhas from "./pages/Funcionario/GerenciarSenhas";
import SelectSector from "./pages/Totem/EscolhaSetor/SelectSector";
import Login from "./pages/Login/index";
import HomePageAdmin from "./pages/HomePageAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Página Inicial</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<h1>Página de Registro</h1>} />
        <Route path="/user" element={<h1>Página do Funcionario</h1>} />
        <Route path="/user/gerenciar" element={<GerenciarSenhas />} />
        <Route path="/toten" element={<SelectService />} />
        <Route path="/sector" element={<SelectSector />} />
        <Route path="/admin" element={<HomePageAdmin />} /> 
        <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
