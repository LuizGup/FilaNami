// ShowKey.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ShowKey = ({ ticket: propTicket }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- LÓGICA DE EXTRAÇÃO ---
  // 1. Tenta pegar do state da navegação (o mais comum vindo do SelectService)
  const stateTicket = location.state?.ticket;

  // 2. Define o valor a ser exibido.
  // Se 'stateTicket' for um objeto (vem do backend), pegamos .senha (ex: "C001")
  // Se for apenas uma string (teste), usamos ela direto.
  let displayValue = '----';
  let setorInfo = '';
  let prioridadeInfo = '';

  if (stateTicket) {
    if (typeof stateTicket === 'object') {
        displayValue = stateTicket.senha || 'ERRO';
        setorInfo = stateTicket.setorDestino;
        prioridadeInfo = stateTicket.prioridade;
    } else {
        displayValue = stateTicket;
    }
  } else if (propTicket) {
      displayValue = propTicket;
  }
  // --------------------------

  const timeoutRef = useRef(null);

  useEffect(() => {
    // Voltar automático para a tela inicial (/toten) em 5 segundos
    timeoutRef.current = setTimeout(() => navigate('/toten'), 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [navigate]);

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center justify-content-center p-4">

      {/* Cabeçalho */}
      <div className="text-center mb-4">
        <div className="mb-3">
          <i className="bi bi-shield-fill-check text-primary fs-2"></i>
        </div>
        <h1 className="display-6 fw-bold text-dark">Fila NAMI</h1>
        <p className="lead text-secondary">Por favor retire sua senha impressa.</p>
      </div>

      {/* Cartão Central */}
      <div className="d-flex flex-column align-items-center">
        <div
          className="bg-white rounded shadow-sm d-flex flex-column align-items-center justify-content-center border"
          style={{ width: 280, height: 280 }}
        >
          {/* Número da Senha */}
          <div className="text-primary" style={{ fontSize: 80, fontWeight: 700, letterSpacing: 4, lineHeight: 1 }}>
            {displayValue}
          </div>
          
          {/* Detalhes extras (Opcional, mas ajuda o usuário) */}
          {setorInfo && (
             <span className="badge bg-light text-dark mt-3 border">
                {setorInfo} • {prioridadeInfo}
             </span>
          )}
        </div>

        {/* Instruções */}
        <div className="text-center mt-4">
          <p className="mb-2 fw-bold text-success">
            <i className="bi bi-check-circle-fill me-2"></i>
            Senha gerada com sucesso!
          </p>
        </div>
      </div>

      {/* Rodapé */}
      <p className="mt-5 text-muted small">© 2024 NAMI. Todos os direitos reservados.</p>
    </div>
  );
};

export default ShowKey;