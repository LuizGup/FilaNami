// ServiceCard.jsx


/**
 * @param {object} props
 * @param {JSX.Element} props.icon - O ícone do cartão.
 * @param {string} props.title - O título do serviço.
 * @param {string} props.description - A descrição do serviço.
 * @param {function} props.onClick - Função chamada ao clicar no cartão.
 * @returns {JSX.Element} Um cartão de serviço estilizado.
 */
const ServiceCard = ({ icon, title, description, onClick }) => {
    // Classes Padrão (Neutras) - Garante que o estilo seja consistente
    const cardClasses = `card text-center h-100 shadow-sm border-0 transition-shadow hover-shadow`;
    const titleClasses = 'text-dark';
    const descriptionClasses = 'text-secondary';
    const iconWrapperClasses = 'rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3 mx-auto bg-light';

    return (
        <div className="col-12 col-sm-6 col-md-4 mb-4">
            <div 
                className={cardClasses} 
                style={{ minHeight: '220px', cursor: 'pointer', transition: 'box-shadow 0.3s' }} 
                onClick={onClick}
                // Adicionando efeitos visuais no hover (simulação de classes Bootstrap não-padrão)
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)'}
            >
                <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                        <div className={iconWrapperClasses} style={{ width: '70px', height: '70px' }}>
                            {icon}
                        </div>
                        <h3 className={`card-title ${titleClasses} fs-5`}>{title}</h3>
                    </div>
                    {/* Renderiza a descrição apenas se houver uma */}
                    {description && <p className={`card-text ${descriptionClasses} mt-2`}>{description}</p>}
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;