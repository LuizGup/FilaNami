import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// 💡 IMPORTAÇÃO DO COMPONENTE REUTILIZÁVEL E DO SERVIÇO
import ServiceCard from '../../../components/GenericCards';
import { createSenha } from '../../../services/senhaService'; 

// Ícone (Definido uma única vez)
const ICON_SECTOR = <i className="bi bi-hospital fs-1 text-primary"></i>;

const SelectSector = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Estado para controlar o loading e evitar cliques duplos
    const [loading, setLoading] = useState(false);

    // 1. RECUPERA A PRIORIDADE VINDA DA TELA ANTERIOR
    // Se por algum motivo for undefined (usuário entrou direto pelo link), assume 'COMUM' ou redireciona
    const priority = location.state?.priority;

    // 2. SEGURANÇA: Se não tiver prioridade, volta para o início (opcional, mas recomendado)
    useEffect(() => {
        if (!priority) {
            console.warn("Nenhuma prioridade detectada. Voltando para o início.");
            navigate('/toten');
        }
    }, [priority, navigate]);

    const handleSectorSelection = async (sectorTitle) => {
        if (loading) return; // Trava se já estiver carregando
        setLoading(true);

        try {
            console.log(`Gerando senha... Setor: ${sectorTitle} | Prioridade: ${priority}`);

            // 3. CHAMA A API COM OS DOIS DADOS (Setor + Prioridade)
            const novaSenha = await createSenha(sectorTitle, priority);

            console.log('Senha gerada com sucesso:', novaSenha);

            // 4. REDIRECIONA PARA A TELA DE IMPRESSÃO COM A SENHA PRONTA
            navigate('/showkey', {
                state: { ticket: novaSenha } // Passamos o objeto completo da senha
            });

        } catch (error) {
            console.error('Erro ao criar senha:', error);
            alert('Erro ao processar sua solicitação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/toten');
    };
    
    return (
        <div className={`container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center p-4 ${loading ? 'opacity-50' : ''}`}>
            
            {/* Botão de Voltar */}
            <div className="position-absolute top-0 start-0 p-4">
                <button 
                    className="btn btn-link text-dark text-decoration-none p-0 border-0" 
                    onClick={handleGoBack}
                    disabled={loading}
                >
                    <i className="bi bi-arrow-left-short fs-1"></i>
                </button>
            </div>

            {/* Cabeçalho */}
            <div className="text-center mb-5 mt-5">
                <div className="mb-3">
                    <i className="bi bi-shield-fill-check text-primary fs-2"></i>
                </div>
                
                <h1 className="display-6 fw-bold text-dark">Fila NAMI</h1>
                <p className="lead text-secondary">
                    {loading 
                        ? "Gerando sua senha, aguarde..." 
                        : <>
                            Prioridade: <strong>{priority === 'PLUSEIGHTY' ? '80+' : priority}</strong>
                            <br/>
                            Selecione o <strong>setor de destino</strong>
                          </>
                    }
                </p>
            </div>

            {/* Lista de Cartões de Setores */}
            <div className="row justify-content-center w-100" style={{ maxWidth: '1000px' }}>
                
                {/* Cartão "Coleta de Sangue" */}
                <ServiceCard
                    icon={ICON_SECTOR}
                    title="Coleta de Sangue"
                    description="Dirija-se à área de coleta para exames laboratoriais." 
                    onClick={() => handleSectorSelection('Coleta de Sangue')}
                    disabled={loading} // Desativa visualmente se o componente suportar
                />

                {/* Você pode adicionar mais setores aqui facilmente */}
                 {/* <ServiceCard
                    icon={<i className="bi bi-clipboard-pulse fs-1 text-success"></i>}
                    title="Recepção Geral"
                    description="Atendimento geral e cadastros." 
                    onClick={() => handleSectorSelection('Recepção Geral')}
                    disabled={loading}
                /> 
                */}

            </div>

            {/* Rodapé */}
            <p className="mt-5 text-muted small">© 2025 NAMI. Todos os direitos reservados.</p>
        </div>
    );
};

export default SelectSector;