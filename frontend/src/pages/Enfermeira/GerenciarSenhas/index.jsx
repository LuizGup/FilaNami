import React from 'react';

const MOCK_WAITING = [
  { id: 'A-123', estWait: '15 mins' },
  { id: 'A-124', estWait: '20 mins' },
  { id: 'A-125', estWait: '22 mins' },
];

const MOCK_COUNTERS = [
  { 
    id: 1, 
    name: 'Guichê 1', 
    tickets: [
      { id: 'B-045', counter: 'Counter 1', servingTime: '3m 12s' },
      { id: 'C-210', counter: 'Counter 2', servingTime: '1m 45s' },
    ] 
  },
  { 
    id: 2, 
    name: 'Guichê 2', 
    tickets: [
      { id: 'B-045', counter: 'Counter 1', servingTime: '3m 12s' },
      { id: 'C-210', counter: 'Counter 2', servingTime: '1m 45s' },
    ] 
  },
  { 
    id: 3, 
    name: 'Guichê 3', 
    tickets: [
      { id: 'B-045', counter: 'Counter 1', servingTime: '3m 12s' },
      { id: 'C-210', counter: 'Counter 2', servingTime: '1m 45s' },
    ] 
  },
  { 
    id: 4, 
    name: 'Guichê 4', 
    tickets: [
      { id: 'B-045', counter: 'Counter 1', servingTime: '3m 12s' },
      { id: 'C-210', counter: 'Counter 2', servingTime: '1m 45s' },
    ] 
  },
];

const MOCK_DONE = [
  { id: 'D-101', counter: 'Counter 4', completedAt: '10:32 AM' },
  { id: 'A-122', counter: 'Counter 3', completedAt: '10:30 AM' },
];

function GerenciarSenhasEnfermeira() {
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '100px' }}>
      {/* 1. Header (Navbar) */}
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container-fluid px-4">
          <a className="navbar-brand" href="#home">
            <i className="bi bi-person-workspace fs-5 me-2"></i>
            Gerenciamento de Senhas
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarUserContent" aria-controls="navbarUserContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarUserContent">
            <img 
              src="https://via.placeholder.com/40" // Substitua pela foto do usuário
              className="rounded-circle"
              alt="User"
            />
          </div>
        </div>
      </nav>

   
      <div className="container-fluid p-4">
        
        <div className="row mb-3 align-items-center">
          <div className="col">
            <h2 className="mb-0">Status Senha</h2>
          </div>
          <div className="col-auto text-muted">
            <i className="bi bi-arrow-clockwise me-1"></i>
            Last updated: Just now
          </div>
        </div>

        <div className="row">
          <div className="col-lg-2 col-md-4 mb-3">
            <h5 className="mb-3 text-secondary">
              <i className="bi bi-trophy fs-5 me-2 text-warning"></i>
              Esperando
              <span className="badge rounded-pill bg-light text-dark ms-2">
                {MOCK_WAITING.length}
              </span>
            </h5>
            {MOCK_WAITING.map(ticket => (
              <div key={ticket.id} className="card mb-3 shadow-sm border-0">
                <div className="card-body p-3">
                  <h5 className="card-title h5 fw-bold mb-1">{ticket.id}</h5>
                  <p className="card-text small text-muted">
                      Tempo de Espera: {ticket.estWait}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {MOCK_COUNTERS.map(counter => (
            <div key={counter.id} className="col-lg-2 col-md-4 mb-3">
              <h5 className="mb-3 text-secondary">
                <i className="bi bi-person-workspace fs-5 me-2 text-primary"></i>
                {counter.name}
              </h5>
              {counter.tickets.map(ticket => (
                <div key={ticket.id + counter.id} className="card mb-3 shadow-sm border-0">
                  <div className="card-body p-3">
                    <h5 className="card-title h5 fw-bold mb-1 text-primary">{ticket.id}</h5>
                    <p className="card-text small text-muted mb-1">
                      {ticket.counter}
                    </p>
                    <p className="card-text small text-dark fw-bold">
                     Em Atendimento: {ticket.servingTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div className="col-lg-2 col-md-4 mb-3">
            <h5 className="mb-3 text-secondary">
              <i className="bi bi-check-circle fs-5 me-2 text-success"></i>
              Feito
              <span className="badge rounded-pill bg-light text-dark ms-2">
                {MOCK_DONE.length}
              </span>
            </h5>
            {MOCK_DONE.map(ticket => (
              <div key={ticket.id} className="card mb-3 shadow-sm border-0">
                <div className="card-body p-3">
                  <h5 className="card-title h5 fw-bold mb-1">{ticket.id}</h5>
                  <p className="card-text small text-muted">
                    Atendido em: {ticket.completedAt}
                    <br />
                    {ticket.counter}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed-bottom p-4">
          <div className="row">
            <div className="col d-flex justify-content-center gap-3">
              <button className="btn btn-primary btn-lg shadow px-5 py-2">
                Chamar senha
              </button>
              <button className="btn btn-primary btn-lg shadow px-5 py-2">
                Exame realizado
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default GerenciarSenhasEnfermeira;
