import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../../components/GenericCards';

// Ícones
const ICON_COMMON = <i className="bi bi-person-fill fs-1 text-primary"></i>;
const ICON_PRIORITY = <i className="bi bi-exclamation-octagon-fill fs-1 text-primary"></i>;
const ICON_80PLUS = <i className="bi bi-plus-circle fs-1 text-primary"></i>;

const SelectService = () => {
    const navigate = useNavigate();

    const handleSelection = (uiPriority) => {
        // 1. Mapeia o texto da UI para o ENUM do Backend aqui mesmo
        let backendPriority;
        switch (uiPriority) {
            case 'Prioridade':
                backendPriority = 'PRIORIDADE';
                break;
            case '80+':
                backendPriority = 'PLUSEIGHTY';
                break;
            case 'Comum':
            default:
                backendPriority = 'COMUM';
                break;
        }

        // 2. Navega para a tela de seleção de setor, levando a prioridade escolhida
        navigate('/sector', { state: { priority: backendPriority } });
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center p-4">
            <div className="text-center mb-5">
                <div className="mb-3">
                    <i className="bi bi-shield-fill-check text-primary fs-2"></i>
                </div>
                
                <h1 className="display-6 fw-bold text-dark">Fila NAMI</h1>
                <p className="lead text-secondary">
                    Por favor, selecione o Tipo de Atendimento
                </p>
            </div>

            <div className="row justify-content-center w-100" style={{ maxWidth: '1000px' }}>
                <ServiceCard
                    icon={ICON_COMMON}
                    title="Senha Comum"
                    description="Para consultas e serviços gerais."
                    onClick={() => handleSelection('Comum')}
                />
                
                <ServiceCard
                    icon={ICON_PRIORITY}
                    title="Senha Prioridade"
                    description="Gestantes, deficientes e prioridades por lei."
                    onClick={() => handleSelection('Prioridade')}
                />
                
                <ServiceCard
                    icon={ICON_80PLUS}
                    title="Senha 80+"
                    description="Atendimento especializado para idosos 80+."
                    onClick={() => handleSelection('80+')}
                />
            </div>

            <p className="mt-5 text-muted small">© 2025 NAMI. Todos os direitos reservados.</p>
        </div>
    );
};

export default SelectService;