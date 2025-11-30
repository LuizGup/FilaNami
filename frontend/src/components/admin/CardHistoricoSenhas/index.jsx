import "./index.css"; // Certifique-se de importar o CardHistoricosCSS.txt aqui

const CardHistoricoSenhas = ({
  passwordNumber,
  generationTime,
  callTime,
  statusText,
  statusClass, // Deve receber 'status-completed', 'status-pending' ou 'status-cancelled'
}) => {
  return (
    // Usa a classe .card-senha definida no seu CSS que tem display: grid
    <div className="card-senha">
      {/* Coluna 1: Número da Senha */}
      <div className="card-item password-number">
        {passwordNumber}
      </div>

      {/* Coluna 2: Horário de Geração */}
      <div className="card-item">
        {generationTime}
      </div>

      {/* Coluna 3: Horário da Chamada */}
      <div className="card-item">
        {callTime}
      </div>

      {/* Coluna 4: Status com a bolinha (dot) definida no seu CSS */}
      <div className={`card-item status ${statusClass}`}>
        <div className="status-dot"></div>
        {statusText}
      </div>
    </div>
  );
};

export default CardHistoricoSenhas;