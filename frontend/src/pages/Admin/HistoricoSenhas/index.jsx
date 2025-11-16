import React, { useState } from 'react';
import './index.css';
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
    console.log("Botão de voltar clicado");
    // Lógica para navegação de volta
  };

  return (
    <div className="historico-page-container">
      <header className="page-header">
        {/*
          *
          * ATUALIZAÇÃO AQUI
          *
        */}
        <div className="left-header-section">
          <button className="return-button-top" onClick={handleReturn}>
            &larr;
          </button>
          <div className="logo-section">
            <div className="logo-icon"></div>
            <div className="app-name">Gerenciamento de Senhas</div>
          </div>
        </div>
        {/* FIM DA ATUALIZAÇÃO */}

        <div className="user-section">
          <input type="text" placeholder="Search by Password Number" className="search-input" />
          <div className="user-avatar"></div>
        </div>
      </header>

      <main className="main-content">
        {/* O título volta a ser como era */}
        <h1 className="page-title">Histórico de Senhas</h1>

        <div className="password-list-wrapper">
          {/* Cabeçalho da Lista */}
          <div className="list-header">
            <div className="header-item">PASSWORD NUMBER</div>
            <div className="header-item">GENERATION TIME</div>
            <div className="header-item">CALL TIME</div>
            <div className="header-item">STATUS</div>
          </div>

          {/* Corpo da Lista */}
          <div>
            {passwords.map((password) => (
              <CardSenha 
              key={password.id} 
              {...password} 
              />
            ))}
          </div>

          {/* Rodapé da Lista */}
          <div className="list-footer">
            <span>Showing 1 to 8 of 100 entries</span>
            <div className="pagination">
              <button className="pagination-button disabled">Previous</button>
              <button className="pagination-button active">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoricoSenhas;