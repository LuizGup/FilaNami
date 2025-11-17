import React, { useState, useEffect } from 'react';

const SelectionModal = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  options = [], 
  confirmText = 'Confirmar', 
  onConfirm 
}) => {
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (!isOpen) setSelectedId(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedId) {
      const selectedOption = options.find(opt => opt.id === selectedId);
      onConfirm(selectedOption);
    }
  };

  return (
    // Fundo escuro e Modal visível
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4 p-3">
          
          <div className="modal-header border-0 d-flex flex-column align-items-center position-relative">
            <button type="button" className="btn-close position-absolute top-0 end-0 m-2" onClick={onClose}></button>
            {title && <h5 className="modal-title fw-bold fs-4">{title}</h5>}
            {subtitle && <h2 className="text-secondary fw-light mt-1">{subtitle}</h2>}
          </div>

          <div className="modal-body">
            <div className="row g-3">
              {options.map((option) => (
                <div className="col-6" key={option.id}>
                  <button
                    className={`btn w-100 py-3 fw-bold rounded-3 transition-all ${
                      selectedId === option.id 
                        ? 'btn-primary shadow' 
                        : 'btn-info text-white' // Usando info/primary para simular o azul da imagem
                    }`}
                    style={{ backgroundColor: selectedId === option.id ? '#065a86' : '#0a7cb9', borderColor: 'transparent' }}
                    onClick={() => setSelectedId(option.id)}
                  >
                    {option.label}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer border-0 justify-content-center">
            <button 
              className="btn btn-primary rounded-pill px-5 py-2 fw-bold"
              style={{ backgroundColor: '#0a7cb9', borderColor: '#0a7cb9' }}
              onClick={handleConfirm}
              disabled={!selectedId}
            >
              {confirmText}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SelectionModal;

/* 
import SelectionModal from './Components/SelectionModal';

// ... dentro do seu componente pai ...

const [modalOpen, setModalOpen] = useState(false);

// Dados que você quer passar para o componente genérico
const guicheOptions = [
  { id: 1, label: 'Guiche 1' },
  { id: 2, label: 'Guiche 2' },
  { id: 3, label: 'Guiche 3' },
  { id: 4, label: 'Guiche 4' },
];

return (
  <>
    <button onClick={() => setModalOpen(true)}>Chamar Senha</button>

    <SelectionModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      title="Chamar Senha"
      subtitle="XX000"
      options={guicheOptions}       // Passando as opções dinamicamente
      confirmText="Chamar"          // Texto do botão dinâmico
      onConfirm={(selectedItem) => {
        console.log("Item selecionado:", selectedItem);
        setModalOpen(false);
      }}
    />
  </>
);
*/