// SelectSector.jsx
import { useNavigate } from 'react-router-dom';
// 💡 IMPORTAÇÃO DO COMPONENTE REUTILIZÁVEL
import ServiceCard from '../../../components/GenericCard';

// Ícone (Definido uma única vez)
const ICON_SECTOR = <i className="bi bi-hospital fs-1 text-primary"></i>;

const SelectSector = () => {
    const navigate = useNavigate();

    const handleSectorSelection = (sectorTitle) => {
        console.log(`Setor escolhido: ${sectorTitle}. Iniciando geração de senha...`);
        // Lógica final para geração de senha
        // Exemplo: navigate('/ticket/gerado'); 
    };

    const handleGoBack = () => {
        // Volta para a tela de seleção de serviço (o '/toten' do seu código anterior)
        navigate('/toten'); 
    };
    
    return (
        <div className="container-fluid bg-light min-vh-100 d-flex flex-column justify-content-center align-items-center p-4">
            
            {/* Botão de Voltar */}
            <div className="position-absolute top-0 start-0 p-4">
                <i 
                    className="bi bi-arrow-left-short fs-1 text-dark" 
                    style={{ cursor: 'pointer' }} 
                    onClick={handleGoBack}
                ></i>
            </div>

            {/* Cabeçalho */}
            <div className="text-center mb-5 mt-5">
                <div className="mb-3">
                    <i className="bi bi-shield-fill-check text-primary fs-2"></i>
                </div>
                
                <h1 className="display-6 fw-bold text-dark">Fila NAMI</h1>
                <p className="lead text-secondary">Por favor, selecione o **setor de destino**</p>
            </div>

            {/* Cartão "Retirar Sangue" */}
            <div className="row justify-content-center w-100" style={{ maxWidth: '1000px' }}>
                <ServiceCard
                    icon={ICON_SECTOR}
                    title="Coleta de Sangue"
                    description="Dirija-se à área de coleta para exames laboratoriais." 
                    onClick={() => handleSectorSelection('Coleta de Sangue')}
                />
            </div>

            {/* Rodapé */}
            <p className="mt-5 text-muted small">© 2024 NAMI. Todos os direitos reservados.</p>
        </div>
    );
};

export default SelectSector;