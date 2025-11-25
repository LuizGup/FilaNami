import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import {
  getAllSenhas,
  chamarProximaSenha,
  concluirSenha
} from '../../../services/senhaService';

import NavbarFuncionario from "../../../components/FuncionarioComponents/NavbarFuncionario";
import SelectionModal from '../../../components/PopUps/PopUpGuiche';

// --- CONFIGURAÇÕES ---
const SETOR_ATUAL = "Exame de Sangue";
const BOXES = [
  { id: 4, name: 'Guichê 1' },
  { id: 5, name: 'Guichê 2' },
  { id: 6, name: 'Guichê 3' },
  { id: 7, name: 'Guichê 4' },
];

function GerenciarSenhasEnfermeira() {
  const [senhas, setSenhas] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Carregando...");
  
  // Estados dos Modais
  const [modalChamadaOpen, setModalChamadaOpen] = useState(false);
  const [modalConclusaoOpen, setModalConclusaoOpen] = useState(false);

  // --- 1. LÓGICA DE DADOS (SOCKET + API) ---
  const fetchSenhas = async () => {
    try {
      const data = await getAllSenhas();
      setSenhas(data || []);
      setLastUpdated(new Date().toLocaleTimeString('pt-BR'));
    } catch (error) {
      console.error("Erro ao buscar senhas:", error);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3000");
    fetchSenhas();

    socket.on('senhaUpdate', (update) => {
      const { action, data } = update;
      
      setSenhas(prev => {
        // Lógica de atualização em tempo real
        if (action === 'createSenha') {
             if (prev.some(s => s.idSenha === data.idSenha)) return prev;
             return [...prev, data];
        }
        if (action === 'update') return prev.map(s => s.idSenha === data.idSenha ? data : s);
        if (action === 'delete') return prev.filter(s => s.idSenha !== data.idSenha);
        return prev;
      });
      setLastUpdated(new Date().toLocaleTimeString('pt-BR'));
    });

    return () => socket.disconnect();
  }, []);


  // --- 2. FILTROS DE DADOS ---
  // Senhas aguardando neste setor
  const filaEspera = senhas.filter(s => s.status === 'AGUARDANDO' && s.setorAtual === SETOR_ATUAL);
  
  // Senhas concluídas (Geral ou filtrado por setor se preferir)
  const filaFeito = senhas
    .filter(s => s.status === 'CONCLUIDO')
    .sort((a,b) => new Date(b.dataConclusao) - new Date(a.dataConclusao)) // Mais recentes primeiro
    .slice(0, 10); // Mostra apenas as 10 últimas para não poluir

  // Próxima senha (Preview para o Modal)
  const proximaSenhaTexto = filaEspera.length > 0 ? filaEspera[0].senha : "---";


  // --- 3. AÇÕES (HANDLERS) ---

  const handleConfirmarChamada = async (option) => {
    setModalChamadaOpen(false);
    try {
      await chamarProximaSenha(option.id, SETOR_ATUAL);
    } catch (error) {
      alert("Erro: " + (error.response?.data?.message || error.message));
    }
  };

  const handleConfirmarConclusao = async (option) => {
    setModalConclusaoOpen(false);
    // O 'option' aqui virá com uma propriedade extra 'idSenha' que injetamos na montagem das opções
    if (option.idSenha) {
      try {
        await concluirSenha(option.idSenha);
      } catch (error) {
        console.error("Erro ao concluir", error);
      }
    }
  };

  // --- 4. PREPARAÇÃO DAS OPÇÕES DOS MODAIS ---
  
  // Opções para CHAMAR: Apenas Box
  const opcoesChamada = BOXES.map(b => ({ id: b.id, label: b.name }));

  // Opções para CONCLUIR: Apenas Boxes que estão OCUPADOS
  const opcoesConclusao = BOXES
    .map(box => {
      const senhaAtiva = senhas.find(s => s.status === 'EM_ATENDIMENTO' && Number(s.idGuicheAtendente) === box.id);
      if (!senhaAtiva) return null;
      return { 
        id: box.id, 
        label: `${box.name} (${senhaAtiva.senha})`, // Ex: Guichê 1 (C001)
        idSenha: senhaAtiva.idSenha // Guardamos o ID da senha para usar na ação
      };
    })
    .filter(Boolean); // Remove os nulos (boxes livres)


  const formatTime = (dateStr) => {
      if(!dateStr) return '--:--';
      return new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' });
  };

  // --- RENDERIZAÇÃO ---
  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '100px' }}>
      
      {/* Navbar Reaproveitada */}
      <NavbarFuncionario />
   
      <div className="container-fluid p-4">
        
        {/* Cabeçalho da Página */}
        <div className="row mb-3 align-items-center">
          <div className="col">
            <h2 className="mb-0 fw-bold text-dark">Gerenciamento de Coletas</h2>
            <small className="text-muted">{SETOR_ATUAL}</small>
          </div>
          <div className="col-auto text-muted">
            <i className="bi bi-arrow-clockwise me-1"></i>
            Atualizado: {lastUpdated}
          </div>
        </div>

        <div className="row">
          
          {/* COLUNA 1: ESPERANDO */}
          <div className="col-lg-2 col-md-4 mb-3">
            <h5 className="mb-3 text-secondary d-flex align-items-center">
              <i className="bi bi-hourglass-split fs-5 me-2 text-warning"></i>
              Fila
              <span className="badge rounded-pill bg-warning text-dark ms-2">
                {filaEspera.length}
              </span>
            </h5>
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {filaEspera.length === 0 && <div className="text-muted small fst-italic">Vazio</div>}
                {filaEspera.map(ticket => (
                <div key={ticket.idSenha} className="card mb-2 shadow-sm border-0 border-start border-4 border-warning">
                    <div className="card-body p-2">
                    <h5 className="card-title h5 fw-bold mb-1">{ticket.senha}</h5>
                    <p className="card-text small text-muted mb-0">
                        {ticket.prioridade}
                    </p>
                    </div>
                </div>
                ))}
            </div>
          </div>

          {/* COLUNAS DINÂMICAS: GUICHÊS (BOXES) */}
          {BOXES.map(box => {
            // Encontra a senha ativa deste box
            const activeTicket = senhas.find(s => s.status === 'EM_ATENDIMENTO' && Number(s.idGuicheAtendente) === box.id);
            
            return (
              <div key={box.id} className="col-lg-2 col-md-4 mb-3">
                <h5 className="mb-3 text-secondary d-flex align-items-center">
                  <i className="bi bi-person-workspace fs-5 me-2 text-primary"></i>
                  {box.name}
                </h5>
                
                {/* Cartão do Atendimento Atual */}
                {activeTicket ? (
                  <div className="card mb-3 shadow border-0 border-top border-4 border-primary">
                    <div className="card-body p-3 text-center">
                      <h5 className="card-title display-6 fw-bold mb-1 text-primary">{activeTicket.senha}</h5>
                      <span className="badge bg-light text-dark border mb-2">{activeTicket.prioridade}</span>
                      <p className="card-text small text-dark fw-bold">
                        Em Atendimento
                      </p>
                      <small className="text-muted" style={{fontSize: '0.75rem'}}>
                         Desde: {formatTime(activeTicket.dataEmissao)}
                      </small>
                      {/* Botão de ação rápida no card */}
                      <button 
                        className="btn btn-sm btn-outline-success w-100 mt-2"
                        onClick={() => handleConfirmarConclusao({ idSenha: activeTicket.idSenha })} // Atalho direto
                      >
                        <i className="bi bi-check-lg"></i> Concluir
                      </button>
                    </div>
                  </div>
                ) : (
                   <div className="card mb-3 border-1 border-dashed bg-transparent">
                      <div className="card-body p-4 text-center text-muted opacity-50">
                          <i className="bi bi-slash-circle fs-4 d-block mb-1"></i>
                          Livre
                      </div>
                   </div>
                )}
              </div>
            );
          })}

          {/* COLUNA FINAL: FEITO */}
          <div className="col-lg-2 col-md-4 mb-3">
            <h5 className="mb-3 text-secondary d-flex align-items-center">
              <i className="bi bi-check-circle fs-5 me-2 text-success"></i>
              Feito
              <span className="badge rounded-pill bg-light text-dark ms-2">
                {filaFeito.length}
              </span>
            </h5>
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {filaFeito.map(ticket => (
                <div key={ticket.idSenha} className="card mb-2 shadow-sm border-0 bg-light opacity-75">
                    <div className="card-body p-2">
                    <div className="d-flex justify-content-between">
                        <h6 className="card-title fw-bold mb-1 text-decoration-line-through text-muted">{ticket.senha}</h6>
                        <small className="text-muted">{formatTime(ticket.dataConclusao)}</small>
                    </div>
                    <p className="card-text small text-muted mb-0">
                        Guichê {ticket.idGuicheAtendente || '?'}
                    </p>
                    </div>
                </div>
                ))}
            </div>
          </div>

        </div>

        {/* BARRA INFERIOR DE AÇÕES GLOBAIS */}
        <div className="fixed-bottom p-4 bg-white border-top shadow-lg">
          <div className="row">
            <div className="col d-flex justify-content-center gap-3">
              
              {/* Botão Chamar */}
              <button 
                className="btn btn-primary btn-lg shadow px-5 py-3 fw-bold"
                onClick={() => setModalChamadaOpen(true)}
              >
                <i className="bi bi-megaphone-fill me-2"></i>
                Chamar senha
              </button>

              {/* Botão Concluir */}
              <button 
                className="btn btn-outline-success btn-lg shadow-sm px-5 py-3 fw-bold"
                onClick={() => {
                    if (opcoesConclusao.length === 0) {
                        alert("Nenhum atendimento em andamento para concluir.");
                    } else {
                        setModalConclusaoOpen(true);
                    }
                }}
              >
                <i className="bi bi-check-circle-fill me-2"></i>
                Exame realizado
              </button>

            </div>
          </div>
        </div>

      </div>

      {/* MODAL CHAMADA */}
      <SelectionModal
        isOpen={modalChamadaOpen}
        onClose={() => setModalChamadaOpen(false)}
        title="Para qual Guichê chamar?"
        subtitle={`Próxima senha: ${proximaSenhaTexto}`}
        options={opcoesChamada}
        confirmText="Chamar"
        onConfirm={handleConfirmarChamada}
      />

      {/* MODAL CONCLUSÃO */}
      <SelectionModal
        isOpen={modalConclusaoOpen}
        onClose={() => setModalConclusaoOpen(false)}
        title="Qual Guichê finalizou?"
        subtitle="Selecione o atendimento concluído"
        options={opcoesConclusao}
        confirmText="Confirmar Conclusão"
        onConfirm={handleConfirmarConclusao}
      />

    </div>
  );
}

export default GerenciarSenhasEnfermeira;