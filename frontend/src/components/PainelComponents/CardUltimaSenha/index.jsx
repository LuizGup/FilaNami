import './index.css';

// Componente simples que recebe a prop 'numero'
function CardUltimaSenha({ numero }) {
  return (
    <div className="ultima-senha-card card shadow-sm text-center">
      <div className="card-body">
        <h5 className="card-title text-secondary-emphasis">
          {numero}
        </h5>
      </div>
    </div>
  );
}

export default CardUltimaSenha;