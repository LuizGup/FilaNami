import React, { useState, useEffect } from 'react';
import CardSenha from '../../../components/admin/CardHistoricoSenhas';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import axios from 'axios'; 

// --- Funções Auxiliares para Tratamento de Dados ---

// Formata data ISO 8601 para H:MM AM/PM
const formatTime = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    }).format(date);
};

// Mapeia o status do backend (em português) para o frontend (em inglês)
const mapStatusToFrontend = (backendStatus) => {
    switch(backendStatus?.toUpperCase()) {
        case 'CONCLUIDO':
            return 'Completed';
        default:
            return backendStatus;
    }
}

// --------------------------------------------------

const HistoricoSenhas = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const API_URL = "http://localhost:3000/api/historico"; 

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        
        const response = await axios.get(API_URL); 
        const rawData = response.data;

        // 2. Mapeia os dados (SEM FILTRO)
        const mappedData = rawData
          // Garante que o objeto 'senha' exista para evitar erros de leitura
          .filter(item => item.senha) 
          // Mapeamento: Extrai os campos aninhados (item.senha)
          .map(item => ({
            id: item.senha.idSenha, // Chave única
            passwordNumber: item.senha.senha,
            generationTime: formatTime(item.senha.dataEmissao),
            // Usa dataConclusao se existir, ou N/A (Pendente ainda não tem data de conclusão)
            callTime: item.senha.dataConclusao ? formatTime(item.senha.dataConclusao) : 'N/A',
            status: mapStatusToFrontend(item.senha.status), 
          }));

        setPasswords(mappedData);
        setLoading(false);

      } catch (err) {
        console.error("Erro ao buscar histórico:", err);
        setError("Não foi possível carregar o histórico. Verifique a API_URL.");
        setLoading(false);
      }
    };
    
    fetchHistorico();
  }, []); // Roda apenas na montagem

  
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
        <h1 className="h2 fw-bold text-dark mb-4">Histórico Completo de Senhas</h1>

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
              {loading && <div className="p-4 text-center text-muted">Carregando histórico...</div>}
              {error && <div className="p-4 text-center text-danger">{error}</div>}
              {!loading && !error && passwords.length === 0 && (
                  <div className="p-4 text-center text-muted">Nenhuma senha encontrada no histórico.</div>
              )}
              
            {passwords.map((password) => (
              <CardSenha 
                key={password.id} 
                {...password} 
              />
            ))}
          </div>

          {/* LIST FOOTER */}
          <div className="card-footer bg-white py-3 px-4 d-flex justify-content-between align-items-center border-top">
            <span className="text-muted small">Mostrando {passwords.length} entradas</span>
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