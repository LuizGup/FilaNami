
import { useNavigate } from 'react-router-dom';
// 💡 IMPORTAÇÃO DO COMPONENTE REUTILIZÁVEL
import ServiceCard from './ServiceCard'; 

// Ícones (Definidos uma única vez)
const ICON_COMMON = <i className="bi bi-person-fill fs-1 text-primary"></i>;
const ICON_PRIORITY = <i className="bi bi-exclamation-octagon-fill fs-1 text-primary"></i>;
const ICON_80PLUS = <i className="bi bi-plus-circle fs-1 text-primary"></i>;

const SelectService = () => {
    const navigate = useNavigate();
    
    const handleSelection = (serviceType) => {
        console.log(`Serviço selecionado: ${serviceType}. Redirecionando para o setor.`);
        // Passa o tipo de serviço no state ou query param se necessário, 
        // mas para o fluxo atual, só navega.
        navigate('/sector'); 
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center p-4">
            <div className="text-center mb-5">
                <div className="mb-3">
                    <i className="bi bi-shield-fill-check text-primary fs-2"></i>
                </div>
                
                <h1 className="display-6 fw-bold text-dark">Fila NAMI</h1>
                <p className="lead text-secondary">Por favor, selecione sua Prioridade de senha </p>
            </div>

            <div className="row justify-content-center w-100" style={{ maxWidth: '1000px' }}>
                
                {/* Cartão 1: Senha Comum */}
                <ServiceCard
                    icon={ICON_COMMON}
                    title="Senha Comum"
                    description="Para consultas e serviços gerais."
                    onClick={() => handleSelection('Comum')}
                />
                
                {/* Cartão 2: Senha Prioridade */}
                <ServiceCard
                    icon={ICON_PRIORITY}
                    title="Senha Prioridade"
                    description="Para pacientes com necessidades urgentes ou idade acima de 60."
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