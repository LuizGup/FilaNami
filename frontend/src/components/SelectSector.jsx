import React from 'react';
import { useNavigate } from 'react-router-dom';
// Assumindo que o ServiceCard foi extraído para ser reutilizado 

// Ícone para o Cartão (usando o mesmo padrão dos outros)
const ICON_SECTOR = <i className="bi bi-hospital fs-1 text-primary"></i>;

const SelectSector = () => {
    const navigate = useNavigate();

    const handleSectorSelection = (sectorTitle) => {
        // Lógica de triagem: Gera a senha para o setor escolhido.
        console.log(`Setor escolhido: ${sectorTitle}. Iniciando geração de senha...`);
        // Aqui você faria a chamada à API do backend para gerar a senha.
        
        // Exemplo: navigate('/senha-gerada');
    };

    const handleGoBack = () => {
        // Volta para a tela anterior (SelectService.jsx)
        navigate(-1);
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center p-4">
            
            {/* 1. Botão/Ícone de Voltar (Return) */}
            <div className="position-absolute top-0 start-0 p-4">
                <i 
                    className="bi bi-arrow-left-short fs-1 text-dark" 
                    style={{ cursor: 'pointer' }} 
                    onClick={handleGoBack}
                ></i>
            </div>

            {/* Cabeçalho Fixo (Fila NAMI e Escudo) */}
            <div className="text-center mb-5 mt-5">
                <div className="mb-3">
                    <i className="bi bi-shield-fill-check text-primary fs-2"></i>
                </div>
                
                <h1 className="display-6 fw-bold text-dark">Fila NAMI</h1>
                <p className="lead text-secondary">Por favor, selecione seu tipo de serviço</p>
            </div>

            {/* 2. Cartão "Retirar Sangue" */}
            <div className="row justify-content-center w-100" style={{ maxWidth: '400px' }}>
                
                <ServiceCard
                    icon={ICON_SECTOR} // Ícone de hospital/setor
                    title="Retirar Sangue"
                    description="" // Descrição opcional, mantendo o visual limpo
                    isPriority={false} // Garantindo a cor padrão branca/clara
                    onClick={() => handleSectorSelection('Retirar Sangue')}
                />
                
            </div>

            <p className="mt-5 text-muted small">© 2024 NAMI. Todos os direitos reservados.</p>
        </div>
    );
};

export default SelectSector;