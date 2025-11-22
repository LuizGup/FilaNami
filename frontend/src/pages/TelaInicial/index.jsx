import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />

const Telainicial = () => {
  const menuOptions = [
    {
      id: 1,
      title: "Totem",
      description: "Levará para a tela de escolhas de senha",
      icon: "confirmation_number",
      link: "#"
    },
    {
      id: 2,
      title: "Exibição das senhas",
      description: "Levará para uma seção de escolha de setores",
      icon: "desktop_windows",
      link: "#"
    },
    {
      id: 3,
      title: "Dashboard Funcionário",
      description: "Acesse para escolher um guichê",
      icon: "badge",
      link: "#"
    },
    {
      id: 4,
      title: "Dashboard Admin",
      description: "Dashboard do administrador.",
      icon: "settings",
      link: "#"
    }
  ];

  return (
  
    <div className="d-flex flex-column min-vh-100 bg-light font-sans">
      
    
      <header className="bg-white border-bottom py-3 sticky-top">
        <div className="container d-flex align-items-center">
          <a href="#" className="d-flex align-items-center text-decoration-none">
            <div className="text-primary d-flex align-items-center" style={{ width: '24px', height: '24px' }}>
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <span className="fs-4 fw-bold text-dark ms-2">Fila Nami</span>
          </a>
        </div>
      </header>

  
      <main className="flex-grow-1 py-5">
        <div className="container" style={{ maxWidth: '960px' }}>
          
          <div className="mb-5 px-2">
            <h1 className="display-5 fw-bold text-dark mb-2">Bem vindo!</h1>
            <p className="text-muted lead fs-6">Selecione uma opção para continuar:</p>
          </div>

          <div className="row g-4">
            {menuOptions.map((option) => (
              <div className="col-12 col-md-6" key={option.id}>
                <a 
                  href={option.link} 
                  className="card h-100 text-decoration-none border shadow-sm rounded-3 p-4 transition-hover"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-body d-flex flex-column align-items-start p-0">
                    <div className="text-primary mb-3">
                      <span className="material-symbols-outlined fs-1">
                        {option.icon}
                      </span>
                    </div>
                    <h3 className="h5 fw-bold text-dark mb-1">{option.title}</h3>
                    <p className="text-muted small mb-0">{option.description}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>

        </div>
      </main>

      <footer className="bg-light border-top py-4 mt-auto">
        <div className="container text-center">
          <div className="d-flex justify-content-center gap-4 mb-3 flex-wrap">
            <a href="#" className="text-secondary text-decoration-none small">Support</a>
            <a href="#" className="text-secondary text-decoration-none small">Contact</a>
            <a href="#" className="text-secondary text-decoration-none small">Privacy Policy</a>
          </div>
          <p className="text-muted small mb-0">© 2025 FILA NAMI - Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
};

export default Telainicial;