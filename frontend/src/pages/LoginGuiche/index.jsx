import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GuicheDisplay from '../../components/GuicheDisplay'; 

const GUICHES_DISPONIVEIS = [
    { id: 1, number: "Guichê 1", sector: "Atendimento", variant: 'primary' },
    { id: 2, number: "Guichê 2", sector: "Atendimento", variant: 'primary' },
    { id: 3, number: "Guichê 1", sector: "Exame de Sangue", variant: 'primary' },
];

const LoginFuncionario = () => {

    const navigate = useNavigate();
    
    const [selectedGuicheId, setSelectedGuicheId] = useState(null);

    const handleGuicheSelection = (guicheId) => {
        setSelectedGuicheId(guicheId);
        console.log(selectedGuicheId)
    };

    const handleLoginClick = () => {
        if (selectedGuicheId !== null) {
            navigate('/HomeFuncionarioSenhas');
        } else {
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
                            type="button" 
                            className="btn btn-primary btn-lg"
                            onClick={handleLoginClick}
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