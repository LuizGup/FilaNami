import React from 'react';

const ICON_COMMON = <i className="bi bi-person-fill fs-1 text-primary"></i>; // Exemplo: ícone de Pessoa
const ICON_PRIORITY = <i className="bi bi-exclamation-octagon-fill fs-1 text-info"></i>; // Exemplo: ícone de Exclamação
const ICON_80PLUS = <i className="bi bi-person-wheelchair fs-1 text-primary"></i>; // Exemplo: ícone de Cadeira de Rodas

// Componente para um único cartão de serviço
const ServiceCard = ({ icon, title, description, isPriority, onClick, iconClass, iconBgClass }) => {
  
  // Classes customizadas para o card de prioridade ficar azul (como na imagem)
  const cardClasses = `card text-center h-100 ${isPriority ? 'bg-info text-white shadow-lg border-0' : 'shadow-sm border-0'}`;
  const titleClasses = isPriority ? 'text-white' : 'text-dark';
  const descriptionClasses = isPriority ? 'text-white-75' : 'text-secondary';
  const iconWrapperClasses = `rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3 mx-auto ${isPriority ? 'bg-white text-info' : 'bg-light'}`;
  
  // Ajustando o ícone para o card de prioridade
  const priorityIcon = isPriority 
    ? React.cloneElement(icon, { className: icon.props.className.replace('text-primary', 'text-info') })
    : icon;
    
  return (
    <div className="col-12 col-md-4 mb-4"> {/* col-md-4 garante 3 colunas em desktop e 100% em mobile */}
      <div className={cardClasses} style={{ minHeight: '280px', cursor: 'pointer' }} onClick={onClick}>
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <div className={iconWrapperClasses} style={{ width: '70px', height: '70px' }}>
              {priorityIcon}
            </div>
            <h3 className={`card-title ${titleClasses} fs-5`}>{title}</h3>
          </div>
          <p className={`card-text ${descriptionClasses} mt-2`}>{description}</p>
        </div>
      </div>
    </div>
  );
};

const SelectService = () => {
  const handleSelection = (serviceType) => {
    // Lógica de navegação ou estado aqui
    console.log(`Serviço selecionado: ${serviceType}`);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center p-4">
      <div className="text-center mb-5">
        {/* Ícone do escudo no topo */}
        <div className="mb-3">
          {/* Exemplo de ícone de escudo do Bootstrap Icons */}
          <i className="bi bi-shield-fill-check text-primary fs-2"></i>
        </div>
        
        <h1 className="display-6 fw-bold text-dark">Fila NAMI</h1>
        <p className="lead text-secondary">Por favor, selecione seu tipo de serviço</p>
      </div>

      <div className="row justify-content-center w-100" style={{ maxWidth: '1000px' }}>
        
        {/* Cartão 1: Senha Comum */}
        <ServiceCard
          icon={ICON_COMMON}
          title="Senha Comum"
          description="Para consultas e serviços gerais."
          onClick={() => handleSelection('Comum')}
        />
        
        {/* Cartão 2: Senha Prioridade (Destacado) */}
        <ServiceCard
          icon={ICON_PRIORITY}
          title="Senha Prioridade"
          description="Para pacientes com necessidades urgentes ou estacionamentos."
          isPriority={true}
          onClick={() => handleSelection('Prioridade')}
        />
        
        {/* Cartão 3: Senha 80+ */}
        <ServiceCard
          icon={ICON_80PLUS}
          title="Senha 80+"
          description="Atendimento especializado para nossos pacientes idosos."
          onClick={() => handleSelection('80+')}
        />
        
      </div>

      <p className="mt-5 text-muted small">© 2024 NAMI. Todos os direitos reservados.</p>
    </div>
  );
};

export default SelectService;