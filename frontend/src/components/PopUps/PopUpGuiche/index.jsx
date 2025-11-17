import React, { useState, useEffect } from 'react';
import './index.css';

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

  // Reseta a seleção quando o modal abre/fecha
  useEffect(() => {
    if (!isOpen) setSelectedId(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedId) {
      // Encontra o objeto completo da opção selecionada
      const selectedOption = options.find(opt => opt.id === selectedId);
      onConfirm(selectedOption);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          {subtitle && <h3 className="modal-subtitle">{subtitle}</h3>}
        </div>

        <div className="options-grid">
          {options.map((option) => (
            <button
              key={option.id}
              className={`option-btn ${selectedId === option.id ? 'active' : ''}`}
              onClick={() => setSelectedId(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="modal-footer">
          <button 
            className={`confirm-btn ${!selectedId ? 'disabled' : ''}`} 
            onClick={handleConfirm}
            disabled={!selectedId}
          >
            {confirmText}
          </button>
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