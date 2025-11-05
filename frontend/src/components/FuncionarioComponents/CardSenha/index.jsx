import './index.css';

/**
 * Componente CardSenha para exibir informações de uma senha.
 * @param {object} props
 * @param {string} props.numero - O número da senha (ex: "A-123").
 * @param {string} props.status - O status da senha, para exibir o texto correto (ex: "Esperando" ou "Feito").
 * @param {string} props.tempo - O texto de tempo estimado/conclusão (ex: "Est. wait: 15 mins").
 * @param {string} props.guicheLabel - O rótulo do guichê (ex: "Next available:" ou "Counter").
 * @param {string} props.guicheValor - O valor do guichê (ex: "Counter 3" ou "3").
 */
function CardSenha({ numero, status, tempo, guicheLabel, guicheValor }) {
  return (
    <div className="card-senha-container">
      {/* Coluna da Esquerda: Número e Estimativa */}
      <div className="card-senha-info">
        <span className="senha-numero">{numero}</span>
        <span className="senha-status">{status}</span>
        <span className="senha-tempo">{tempo}</span>
      </div>

      {/* Coluna da Direita: Guichê */}
      <div className="card-senha-guiche">
        <span className="guiche-label">
          {guicheLabel}
        </span>
        <span className="guiche-valor">
          {guicheValor}
        </span>
      </div>
    </div>
  );
}

export default CardSenha;