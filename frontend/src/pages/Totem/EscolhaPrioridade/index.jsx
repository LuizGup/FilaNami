import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importa o serviço que criamos anteriormente
import ServiceCard from '../../../components/GenericCards';
import { createSenha } from '../../../services/senhaService';

// Ícones
const ICON_COMMON = <i className="bi bi-person-fill fs-1 text-primary"></i>;
const ICON_PRIORITY = <i className="bi bi-exclamation-octagon-fill fs-1 text-primary"></i>;
const ICON_80PLUS = <i className="bi bi-plus-circle fs-1 text-primary"></i>;

const SelectService = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // CONFIGURAÇÃO: Defina para onde a senha vai. 
    // Pode vir de uma tela anterior (history state) ou ser fixo.
    const SETOR_DESTINO = "Exame de Sangue"; 

    const handleSelection = async (uiPriority) => {
        if (loading) return; // Evita clique duplo

        setLoading(true);

        // 1. Mapeia o texto da UI para o ENUM do Backend (Prisma)
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

        try {
            console.log(`Criando senha: ${backendPriority} para ${SETOR_DESTINO}...`);
            
            // 2. Chama o serviço (API)
            const novaSenha = await createSenha(SETOR_DESTINO, backendPriority);

            console.log('Senha criada com sucesso:', novaSenha);

            // 3. Redireciona para a tela de impressão/confirmação
            // Passamos o objeto da senha criada via 'state' para mostrar o número na próxima tela
            navigate('/showkey', { state: { ticket: novaSenha } });

        } catch (error) {
            console.error('Erro ao criar senha:', error);
            alert('Erro ao gerar senha. Tente novamente ou chame um atendente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center p-4 ${loading ? 'opacity-50' : ''}`}>
            <div className="text-center mb-5">
                <div className="mb-3">
                    <i className="bi bi-shield-fill-check text-primary fs-2"></i>
                </div>
                
                <h1 className="display-6 fw-bold text-dark">Fila NAMI</h1>
                <p className="lead text-secondary">
                    {loading ? "Gerando sua senha..." : "Por favor, selecione sua Prioridade de senha"}
                </p>
            </div>

            <div className="row justify-content-center w-100" style={{ maxWidth: '1000px' }}>
                
                {/* Cartão 1: Senha Comum */}
                <ServiceCard
                    icon={ICON_COMMON}
                    title="Senha Comum"
                    description="Para consultas e serviços gerais."
                    onClick={() => handleSelection('Comum')}
                    disabled={loading} // Se seu componente suportar disabled
                />
                
                {/* Cartão 2: Senha Prioridade */}
                <ServiceCard
                    icon={ICON_PRIORITY}
                    title="Senha Prioridade"
                    description="Para pacientes com necessidades urgentes ou idade acima de 60."
                    onClick={() => handleSelection('Prioridade')}
                    disabled={loading}
                />
                
                {/* Cartão 3: Senha 80+ */}
                <ServiceCard
                    icon={ICON_80PLUS}
                    title="Senha 80+"
                    description="Atendimento especializado para nossos pacientes idosos."
                    onClick={() => handleSelection('80+')}
                    disabled={loading}
                />
                
            </div>

            <p className="mt-5 text-muted small">© 2024 NAMI. Todos os direitos reservados.</p>
        </div>
    );
};

export default SelectService;