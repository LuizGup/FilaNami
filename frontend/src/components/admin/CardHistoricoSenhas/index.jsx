import React from 'react';
import './index.css';

const CardSenha = ({ passwordNumber, generationTime, callTime, status }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'status-completed';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="card-senha">
      <div className="card-item password-number">{passwordNumber}</div>
      <div className="card-item generation-time">{generationTime}</div>
      <div className="card-item call-time">{callTime}</div>
      <div className={`card-item status ${getStatusClass(status)}`}>
        <span className="status-dot"></span> {status}
      </div>
    </div>
  );
};

export default CardSenha;