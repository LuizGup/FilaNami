import React, { useState } from 'react';
// 💡 IMPORTANTE: Importar useNavigate para gerenciar o fluxo de tela
import { useNavigate } from 'react-router-dom';
import GuicheDisplay from '../../components/GuicheDisplay'; 

// Dados fixos para o design
const GUICHES_DISPONIVEIS = [
    { id: 1, number: "Guichê 1", sector: "Atendimento", variant: 'primary' },
    { id: 2, number: "Guichê 2", sector: "Atendimento", variant: 'primary' },
    { id: 3, number: "Guichê 1", sector: "Exame de Sangue", variant: 'primary' },
];

const LoginFuncionario = () => {
    
    // 1. Hook para navegação
    const navigate = useNavigate();
    
    // Estado que gerencia a seleção visual do guichê (manter o design interativo)
    const [selectedGuicheId, setSelectedGuicheId] = useState(null);

    const handleGuicheSelection = (guicheId) => {
        setSelectedGuicheId(guicheId);
    };

    // 💡 Nova função para lidar com o clique no botão de Login
    const handleLoginClick = () => {
        // Verifica se algum guichê foi selecionado antes de navegar (melhora o UX do design)
        if (selectedGuicheId !== null) {
            // 2. Executa a navegação para a rota desejada (sem lógica de autenticação)
            navigate('/HomeFuncionarioSenhas');
        } else {
            // Design/UX: Alerta o usuário se ele esquecer de selecionar o guichê
            alert("Por favor, selecione um Guichê disponível para continuar.");
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center p-4">
            <div 
                className="card p-4 p-md-5 rounded-4 shadow" 
                style={{ maxWidth: '600px', width: '90%', backgroundColor: 'white' }}
            >
                <div className="text-center mb-4">
                    <h1 className="display-6 fw-bold text-dark">Fila Nami</h1>
                    <p className="lead text-secondary text-uppercase fw-semibold mb-0">Login</p>
                    <p className="text-muted small mt-0">NAMI LOGIN</p>
                </div>

                {/* Área de exibição dos Guichês disponíveis */}
                <div className="row justify-content-center mb-4">
                    {GUICHES_DISPONIVEIS.map((guiche) => (
                        <GuicheDisplay
                            key={guiche.id}
                            number={guiche.number}
                            sector={guiche.sector}
                            variant={guiche.variant}
                            onClick={() => handleGuicheSelection(guiche.id)} 
                            isSelected={guiche.id === selectedGuicheId}
                        />
                    ))}
                </div>
                
                {/* Formulário (Design e Fluxo de Navegação) */}
                {/* Removido o <form> ou mudado para um <div> para evitar submissão padrão */}
                <div> 
                    <div className="mb-4">
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Password"
                            required
                        />
                    </div>
                    
                    <div className="d-grid">
                        <button 
                            // 💡 Alterado para type="button" para evitar recarregar a página
                            type="button" 
                            className="btn btn-primary btn-lg"
                            // 💡 Adicionado o onClick para executar a navegação
                            onClick={handleLoginClick}
                            // O botão só fica ativo se um guichê for selecionado (melhor UX)
                            disabled={!selectedGuicheId}
                        >
                            Login
                        </button>
                    </div>
                </div>

                <p className="mt-5 text-center text-muted small">© 2025 NAMI. All rights reserved.</p>
            </div>
        </div>
    );
};

export default LoginFuncionario;