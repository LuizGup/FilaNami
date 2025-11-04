import React from 'react';

// Os ícones não precisam mudar de cor aqui, pois o fundo do card será neutro.
const ICON_COMMON = <i className="bi bi-person-fill fs-1 text-primary"></i>; // Ícone Padrão
const ICON_PRIORITY = <i className="bi bi-exclamation-octagon-fill fs-1 text-primary"></i>; // Ícone Padrão
const ICON_80PLUS = <i className="bi bi-plus-circle fs-1 text-primary"></i>; // Ícone Padrão

// Componente para um único cartão de serviço
const ServiceCard = ({ icon, title, description, isPriority, onClick, iconClass, iconBgClass }) => {
  
  // === MODIFICAÇÃO CHAVE: Usar SEMPRE as classes neutras/padrão ===
  // O valor de `isPriority` é ignorado aqui para garantir a cor consistente.
  
  // Classes Padrão (Neutras)
  const cardClasses = `card text-center h-100 shadow-sm border-0`; // Retirado o 'bg-info'
  const titleClasses = 'text-dark'; // Título sempre escuro
  const descriptionClasses = 'text-secondary'; // Descrição sempre secundária
  const iconWrapperClasses = 'rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3 mx-auto bg-light'; // Fundo do ícone sempre claro
  
  // Não é necessário clonar o elemento do ícone se o fundo do cartão não for azul/ciano
  const finalIcon = icon;
    
  return (
    <div className="col-12 col-md-4 mb-4">
      <div className={cardClasses} style={{ minHeight: '280px', cursor: 'pointer' }} onClick={onClick}>
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <div className={iconWrapperClasses} style={{ width: '70px', height: '70px' }}>
              {finalIcon}
            </div>
            <h3 className={`card-title ${titleClasses} fs-5`}>{title}</h3>
          </div>
          <p className={`card-text ${descriptionClasses} mt-2`}>{description}</p>
        </div>
      </div>
    </div>
  );
};

// ... (O componente SelectService permanece o mesmo, pois o trabalho foi no ServiceCard)
const SelectService = () => {
  // ... (handleSelection e o resto do código)
  const handleSelection = (serviceType) => {
    // Lógica de navegação ou estado aqui
    console.log(`Serviço selecionado: ${serviceType}`);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center p-4">
      <div className="text-center mb-5">
        <div className="mb-3">
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
        
        {/* Cartão 2: Senha Prioridade (Agora com cor padrão) */}
        <ServiceCard
          icon={ICON_PRIORITY}
          title="Senha Prioridade"
          description="Para pacientes com necessidades urgentes ou com idade acima de 60."
          isPriority={true} // O isPriority agora é ignorado no visual, mas mantido na estrutura
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