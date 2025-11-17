import React from 'react';

const CardHistoricoSenhas = ({ passwordNumber, generationTime, callTime, status }) => {
  
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-success bg-opacity-10 text-success border border-success border-opacity-25';
      case 'pending':
        return 'bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25';
      case 'cancelled':
        return 'bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="row align-items-center border-bottom py-3 px-4 hover-bg-light transition-base">
      <div className="col fw-bold text-dark">
        {passwordNumber}
      </div>
      <div className="col text-muted small">
        {generationTime}
      </div>
      <div className="col text-muted small">
        {callTime}
      </div>
      <div className="col">
        <span className={`badge rounded-pill px-3 py-2 fw-normal ${getStatusBadge(status)}`}>
          <i className="bi bi-circle-fill me-1" style={{ fontSize: '6px', verticalAlign: 'middle' }}></i>
          {status}
        </span>
      </div>
    </div>
  );
};

export default CardHistoricoSenhas;