// ShowKey.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ShowKey = ({ ticket: propTicket }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ticket pode vir por props, ou por navigate(..., { state: { ticket } })
  const ticket = propTicket || (location.state && location.state.ticket) || 'AAXX';

  const timeoutRef = useRef(null);

  useEffect(() => {
    // voltar automatico em 5s
    timeoutRef.current = setTimeout(() => navigate('/toten'), 5000);
    return () => clearTimeout(timeoutRef.current);
  }, [navigate]);

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center justify-content-center p-4">

      {/* cabeçalho */}
      <div className="text-center mb-4">
        <div className="mb-3">
          <i className="bi bi-shield-fill-check text-primary fs-2"></i>
        </div>
        <h1 className="display-6 fw-bold text-dark">Fila NAMI</h1>
        <p className="lead text-secondary">Por favor retire sua senha impressa.</p>
      </div>

      {/* cartão central */}
      <div className="d-flex flex-column align-items-center">
        <div
          className="bg-white rounded shadow-sm d-flex align-items-center justify-content-center"
          style={{ width: 260, height: 260 }}
        >
          <div style={{ fontSize: 72, fontWeight: 400, letterSpacing: 6 }}>{ticket}</div>
        </div>

        {/* instruções */}
        <div className="text-center mt-3">
          <p className="mb-2 text-secondary">Sua senha foi gerada com sucesso.</p>
          <div className="mt-2 text-muted small">Aguarde... você será redirecionado em 5 segundos.</div>
        </div>
      </div>

      {/* rodapé */}
      <p className="mt-5 text-muted small">© 2024 NAMI. Todos os direitos reservados.</p>
    </div>
  );
};

export default ShowKey;
