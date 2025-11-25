import React, { useState } from 'react';
import CardSenha from '../../../components/admin/CardHistoricoSenhas';
const HistoricoSenhas = () => {
  const [passwords] = useState([
    { id: 1, passwordNumber: 'A123', generationTime: '10:00 AM', callTime: '10:15 AM', status: 'Completed' },
    { id: 2, passwordNumber: 'B456', generationTime: '10:05 AM', callTime: '10:20 AM', status: 'Completed' },
    { id: 3, passwordNumber: 'C789', generationTime: '10:10 AM', callTime: '10:25 AM', status: 'Completed' },
    { id: 4, passwordNumber: 'D012', generationTime: '10:15 AM', callTime: '10:30 AM', status: 'Pending' },
    { id: 5, passwordNumber: 'E345', generationTime: '10:20 AM', callTime: '10:35 AM', status: 'Completed' },
    { id: 6, passwordNumber: 'F678', generationTime: '10:25 AM', callTime: '10:40 AM', status: 'Cancelled' },
    { id: 7, passwordNumber: 'G901', generationTime: '10:30 AM', callTime: '10:50 AM', status: 'Completed' },
    { id: 8, passwordNumber: 'H234', generationTime: '10:35 AM', callTime: '10:50 AM', status: 'Completed' },
  ]);
  
  const handleReturn = () => {
    console.log("Retornando à página anterior...");
    // Aqui você pode usar algo como useNavigate() do react-router-dom para navegar 
  };

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      {/* HEADER */}
      <header className="bg-white shadow-sm py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-link text-decoration-none text-secondary fs-4 p-0 me-3 d-flex align-items-center" 
            onClick={handleReturn}
          >
            &larr;
          </button>
          
          <div className="d-flex align-items-center">
            <div className="bg-primary rounded me-2" style={{ width: '32px', height: '32px' }}></div>
            <span className="fw-bold text-dark fs-5">Gerenciamento de Senhas</span>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <input 
            type="text" 
            className="form-control rounded-pill bg-light border-0 me-3" 
            placeholder="Search by Password Number" 
            style={{ width: '250px' }}
          />
          <div className="bg-secondary rounded-circle" style={{ width: '40px', height: '40px' }}></div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow-1 p-4 container-xl">
        <h1 className="h2 fw-bold text-dark mb-4">Histórico de Senhas</h1>

        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
          
          {/* LIST HEADER */}
          <div className="card-header bg-light border-bottom py-3 px-4">
            <div className="row fw-bold text-secondary small text-uppercase">
              <div className="col">Password Number</div>
              <div className="col">Generation Time</div>
              <div className="col">Call Time</div>
              <div className="col">Status</div>
            </div>
          </div>

          {/* LIST BODY */}
          <div className="card-body p-0">
            {passwords.map((password) => (
              <CardSenha 
                key={password.id} 
                {...password} 
              />
            ))}
          </div>

          {/* LIST FOOTER */}
          <div className="card-footer bg-white py-3 px-4 d-flex justify-content-between align-items-center border-top">
            <span className="text-muted small">Showing 1 to 8 of 100 entries</span>
            <div>
              <button className="btn btn-light border btn-sm me-2 text-muted" disabled>Previous</button>
              <button className="btn btn-primary btn-sm">Next</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default HistoricoSenhas;