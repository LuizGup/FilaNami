import { BrowserRouter, Routes, Route } from "react-router-dom";
import SelectService from './components/SelectService';


function App() {

  return (
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<h1>Página Inicial</h1>} />
            <Route path="/login" element={<h1>Página de Login</h1>} />
            <Route path="/sign-up" element={<h1>Página de Registro</h1>} />
            <Route path="/user" element={<h1>Página do Funcionario</h1>} >
              <Route path="/user/select-service" element={<SelectService />} />
            </Route>
            <Route path="/admin" element={<h1>Página do Admin</h1>} />
            <Route path="*" element={<h1>404 - Página não encontrada</h1>} />
          </Routes>
    </BrowserRouter>
  );
}


export default App
