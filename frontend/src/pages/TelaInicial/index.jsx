import { useNavigate } from 'react-router-dom';
import Header from '../../components/HeaderFilaNami/Header';
import MenuCard from '../../components/MenuCardTelaInicial/MenuCard';
const TelaInicial = () => {
  const navigate = useNavigate();
  const menuOptions = [
    {
      id: 1,
      title: "Totem",
      description: "Levará para a tela de escolhas de senha",
      icon: "bi-ticket-perforated",
      path: "/toten"
    },
    {
      id: 2,
      title: "Exibição das senhas",
      description: "Levará para uma seção de escolha de setores",
      icon: "bi-display",
      path: "/painel"
    },
    {
      id: 3,
      title: "Dashboard Funcionário",
      description: "Acesse para escolher um guichê",
      icon: "bi-person-badge",
      path: "/login-guiche"
    },
    {
      id: 4,
      title: "Dashboard Admin",
      description: "Dashboard do administrador.",
      icon: "bi-gear-fill",
      path: "/admin"
    }
  ];

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">

      <Header
        appName="Fila Nami"
        iconClass="bi-heart-pulse-fill"
      />

      <main className="flex-grow-1 py-5">
        <div className="container" style={{ maxWidth: '970px' }}>



          <div className="mb-5 px-2">
            <h1 className="display-5 fw-bold text-dark mb-2">Bem vindo!</h1>
            <p className="text-muted lead fs-6">Selecione uma opção para continuar:</p>
          </div>

          <div className="row row-cols-1 row-cols-md-2 g-4">
            {menuOptions.map((option) => (
              <div className="col" key={option.id}>
                <MenuCard
                  title={option.title}
                  description={option.description}
                  icon={`bi ${option.icon}`}
                  onClick={() => navigate(option.path)}
                />
              </div>
            ))}
          </div>

        </div>
      </main>

      <footer className="bg-light border-top py-4 mt-auto">
        <div className="container text-center">
          <p className="text-muted small mb-0">© 2025 FILA NAMI</p>
        </div>
      </footer>
    </div>
  );
};

export default TelaInicial;