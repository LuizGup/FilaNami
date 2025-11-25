

/**
 * Componente: GuicheDisplay
 * ...
 * @param {boolean} [props.isSelected=false] - Se true, aplica a borda de seleção preta.
 * @param {function} props.onClick - Função chamada ao clicar no cartão.
 * @returns {JSX.Element} Um cartão estilizado para exibição de guichê.
 */
const GuicheDisplay = ({ number, sector, onClick, variant = 'primary', isSelected = false }) => {
    
    // Classes Base
    const baseClasses = `card text-white bg-${variant} rounded-4 shadow-sm h-100`;
    
    const selectionClass = isSelected 
        ? 'border border-dark border-3' 
        : 'border border-transparent border-0'; // Garante que cards não selecionados não tenham borda

    const cardClasses = `${baseClasses} ${selectionClass}`;

    return (
        <div className="col-12 col-md-4 col-lg-3 mb-4">
            <div 
                className={cardClasses}
                style={{ minHeight: '120px', cursor: 'pointer' }} 
                onClick={onClick}
            >
                <div className="card-body d-flex flex-column justify-content-center p-3">
                    {/* Conteúdo do Guichê (omitido para brevidade) */}
                    <div className="mb-3">
                        <div className="fs-6 fw-bold mb-1">Nº: {number}</div>
                    </div>
                    <div>
                        <div className="fs-6 mb-1">Setor:</div>
                        <div className="fs-5 fw-normal">{sector}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GuicheDisplay;