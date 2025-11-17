import NavbarAdmin from "../../components/AdminComponents/NavbarAdmin";
import RouteButton from "../../components/AdminComponents/RouteButton";

import "./index.css";

function HomePageAdmin() {
  return (
    <div className="homepage-admin-container">
      <NavbarAdmin />

      <main className="container d-flex flex-column justify-content-center align-items-center homepage-admin-main">
        <h1 className="homepage-admin-title">Fila NAMI</h1>
        <p className="homepage-admin-subtitle">
          Bem vindo ao Gerenciamento de Senhas
        </p>

        <div className="mt-4">
          <RouteButton
            label="Histórico de Senhas"
            to="/admin/historico"
            icon={<i className="bi bi-card-list" />}
          />
        </div>
      </main>

      <footer className="homepage-admin-footer">
        © 2025 NAMI. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default HomePageAdmin;
