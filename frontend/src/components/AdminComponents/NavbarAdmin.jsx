import "./NavbarAdmin.css";

function NavbarAdmin() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm navbar-admin">
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center gap-2">
          <div className="navbar-admin-logo">
            <span className="navbar-admin-logo-icon" />
          </div>
          <div className="d-flex flex-column">
            <span className="navbar-admin-title">Gerenciamento de Senhas</span>
            <span className="navbar-admin-subtitle">Painel Administrativo</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarAdmin;
