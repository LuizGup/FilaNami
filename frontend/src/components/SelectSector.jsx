import React from 'react';
import { useNavigate } from 'react-router-dom'; // Para a funcionalidade do botão de voltar

// =========================================================
// Componente ServiceCard (Aninhado para este exemplo)
// RECOMENDAÇÃO: Em um projeto real, mova este ServiceCard para um arquivo separado
// (ex: 'src/components/ServiceCard.jsx') e importe-o.
// =========================================================
const ServiceCard = ({ icon, title, description, isPriority, onClick }) => {
  // Classes customizadas para o card (sempre neutro, como pedido)
  const cardClasses = `card text-center h-100 shadow-sm border-0`;
  const titleClasses = 'text-dark';
  const descriptionClasses = 'text-secondary';
  const iconWrapperClasses = `rounded-circle d-inline-flex align-items-center justify-content-center p-3 mb-3 mx-auto bg-light`;
    
  return (
    <div className="col-12 col-md-4 mb-4">
      <div className={cardClasses} style={{ minHeight: '200px', cursor: 'pointer' }} onClick={onClick}>
        <div className="card-body d-flex flex-column justify-content-between">
          <div>
            <div className={iconWrapperClasses} style={{ width: '70px', height: '70px' }}>
              {icon}
            </div>
            <h3 className={`card-title ${titleClasses} fs-5`}>{title}</h3>
          </div>
          <p className={`card-text ${descriptionClasses} mt-2`}>{description}</p>
        </div>
      </div>
    </div>
  );
};
// =========================================================


// Ícone para o Cartão de Setor
const ICON_SECTOR = <i className="bi bi-hospital fs-1 text-primary"></i>;

const SelectSector = () => {
    const navigate = useNavigate();

    const handleSectorSelection = (sectorTitle) => {
        // Esta função deve continuar gerando a senha ou fazendo a lógica do setor.
        // Se você não quer que a seleção de setor navegue para '/toten', mantenha a lógica original.
        console.log(`Setor escolhido: ${sectorTitle}. Iniciando geração de senha...`);
        // navigate('/senha-gerada'); // Ou outra rota de confirmação
    };

    const handleGoBack = () => {
        // 🚨 MUDANÇA AQUI: O botão de voltar agora navega diretamente para /toten
        navigate('/toten');
    };
    

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center p-4">
            
            {/* Ícone de Voltar (Return) */}
            <div className="position-absolute top-0 start-0 p-4">
                <i 
                    className="bi bi-arrow-left-short fs-1 text-dark" 
                    style={{ cursor: 'pointer' }} 
                    onClick={handleGoBack}
                ></i>
            </div>

            {/* Cabeçalho Fixo (Fila NAMI e Escudo) - Renderizado APENAS UMA VEZ */}
            <div className="text-center mb-5 mt-5">
                <div className="mb-3">
                    <i className="bi bi-shield-fill-check text-primary fs-2"></i>
                </div>
                
                <h1 className="display-6 fw-bold text-dark">Fila NAMI</h1>
                <p className="lead text-secondary">Por favor, selecione seu tipo de serviço</p>
            </div>

            {/* Cartão "Retirar Sangue" */}
            <div className="row justify-content-center w-100" style={{ maxWidth: '1000px' }}>
                <ServiceCard
                    icon={ICON_SECTOR}
                    title="Retirar Sangue"
                    description="" // Descrição vazia para o visual da imagem
                    isPriority={false} // Garante o estilo padrão (branco)
                    onClick={() => handleSectorSelection('Retirar Sangue')}
                />
            </div>

            {/* Rodapé */}
            <p className="mt-5 text-muted small">© 2024 NAMI. Todos os direitos reservados.</p>
        </div>
    );
};

export default SelectSector;