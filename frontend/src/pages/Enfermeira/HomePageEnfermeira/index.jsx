import NavbarAdmin from "../../../components/AdminComponents/NavbarAdmin";
import RouteButton from "../../../components/GenericButtons/RouteButton";
import "./index.css";

function HomePageEnfermeira() {
  return (
    <div className="homepage-enfermeira-wrapper">
      <NavbarAdmin />

      <main className="container d-flex flex-column justify-content-center align-items-center homepage-enfermeira-main">
        <h1 className="homepage-enfermeira-title">Fila NAMI</h1>

        <p className="homepage-enfermeira-subtitle">
          Bem vinda ao Gerenciamento de Senhas
        </p>

        <div className="mt-4">
          <RouteButton
            label="Gerenciamento de Senhas"
            to="/enfermeira/gerenciar"  
            icon={<i className="bi bi-person" />}
          />
        </div>
      </main>

      <footer className="homepage-enfermeira-footer text-muted">
        © 2025 NAMI. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default HomePageEnfermeira;
