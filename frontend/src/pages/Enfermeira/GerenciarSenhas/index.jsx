import { useState, useEffect, useCallback } from 'react';
import { io } from "socket.io-client";
import {
  getAllSenhas,
  chamarProximaSenha,
  concluirSenha,
  deleteSenha
} from '../../../services/senhaService';

import NavbarFuncionario from "../../../components/FuncionarioComponents/NavbarFuncionario";
import SelectionModal from '../../../components/PopUps/PopUpGuiche';

const SETOR_ATUAL = "Coleta de Sangue";
const BOXES = [
  { id: 4, name: 'Guichê 1' },
  { id: 5, name: 'Guichê 2' },
  { id: 6, name: 'Guichê 3' },
  { id: 7, name: 'Guichê 4' },
];

function GerenciarSenhasEnfermeira() {
  const [senhas, setSenhas] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Carregando...");
  
  // Modais
  const [modalChamadaOpen, setModalChamadaOpen] = useState(false);
  const [modalDeletarOpen, setModalDeletarOpen] = useState(false);
  const [modalRechamarOpen, setModalRechamarOpen] = useState(false);

  const fetchSenhas = useCallback(async () => {
    try {
      const data = await getAllSenhas();
      setSenhas(data || []);
      setLastUpdated(new Date().toLocaleTimeString('pt-BR'));
    } catch (error) {
      console.error("Erro ao buscar senhas:", error);
    }
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    fetchSenhas();

    socket.on('senhaUpdate', () => {
      fetchSenhas();
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchSenhas]);

  // Filtros
  const filaEspera = senhas.filter(s => s.status === 'AGUARDANDO' && s.setorAtual === SETOR_ATUAL);
  
  const emAtendimento = senhas.filter(s => 
    s.status === 'EM_ATENDIMENTO' && 
    (BOXES.some(b => b.id === Number(s.idGuicheAtendente)))
  );

  const filaFeito = senhas
    .filter(s => s.status === 'CONCLUIDO')
    .sort((a,b) => new Date(b.dataConclusao) - new Date(a.dataConclusao))
    .slice(0, 10); 

  const proximaSenhaTexto = filaEspera.length > 0 ? filaEspera[0].senha : "---";

  // --- LÓGICA DE ENVIO "FAKE" PARA O PAINEL ---
  const enviarParaPainel = (ticket, boxId) => {
    const channel = new BroadcastChannel('fila_nami_channel');

    const boxEncontrado = BOXES.find(b => b.id === Number(boxId));
    const numeroVisual = boxEncontrado ? boxEncontrado.name.replace("Guichê ", "") : "?";

    const dadosFake = {
        ...ticket,
        setorAtual: SETOR_ATUAL,    // Força "Coleta de Sangue"
        setorDestino: SETOR_ATUAL,  
        idGuiche: numeroVisual      // Força "1", "2"...
    };

    channel.postMessage({ 
        type: 'CHAMAR_NOVAMENTE', 
        payload: dadosFake 
    });
    
    // Fecha o canal rapidinho pra limpar memória
    setTimeout(() => channel.close(), 100);
  };

  const handleConfirmarChamada = async (option) => {
    setModalChamadaOpen(false);
    try {
      const novaSenha = await chamarProximaSenha(option.id, SETOR_ATUAL);
      if (novaSenha) enviarParaPainel(novaSenha, option.id);
    } catch (error) {
      alert("Erro: " + (error.response?.data?.message || error.message));
    }
  };

  const handleConfirmarRechamada = (option) => {
    setModalRechamarOpen(false);
    const ticket = option.fullTicket;
    if (ticket) {
        enviarParaPainel(ticket, ticket.idGuicheAtendente);
    }
  };

  const handleConcluirDireto = async (idSenha) => {
    try {
      await concluirSenha(idSenha);
      fetchSenhas();
    } catch (error) {
      console.error("Erro ao concluir", error);
    }
  };

  const handleConfirmarDelecao = async (option) => {
    setModalDeletarOpen(false);
    if (option.idSenha) {
        if (window.confirm(`Tem certeza que deseja remover a senha ${option.label}?`)) {
            try {
                await deleteSenha(option.idSenha);
                fetchSenhas();
            } catch (error) {
                alert("Erro ao deletar: " + error.message);
            }
        }
    }
  };

  const opcoesChamada = BOXES.map(b => ({ id: b.id, label: b.name }));

  const opcoesRechamar = emAtendimento.map(s => {
      const box = BOXES.find(b => b.id === Number(s.idGuicheAtendente));
      const boxName = box ? box.name : "Guichê ?";
      return {
          id: s.idSenha,
          label: `${boxName} — ${s.senha}`,
          fullTicket: s
      };
  });

  const opcoesDeletar = [
      ...emAtendimento.map(s => ({ id: s.idSenha, label: `Em Atendimento: ${s.senha}`, idSenha: s.idSenha })),
      ...filaEspera.map(s => ({ id: s.idSenha, label: `Na Fila: ${s.senha}`, idSenha: s.idSenha }))
  ];

  const formatTime = (dateStr) => dateStr ? new Date(dateStr).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' }) : '--:--';

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <NavbarFuncionario />
      <div className="container-fluid p-4 flex-grow-1">
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-0">Status Senha</h2>
            <small className="text-muted text-uppercase fw-bold">{SETOR_ATUAL}</small>
          </div>
          <div className="text-muted small">Atualizado às: <span className="fw-bold text-dark">{lastUpdated}</span></div>
        </div>

        <div className="row g-4">
          {/* ESPERA */}
          <div className="col-lg-2 col-md-4">
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center"><i className="bi bi-hourglass-split fs-5 text-warning me-2"></i><span className="fw-bold text-dark">Esperando</span></div>
                    <span className="badge bg-light text-primary fs-6 border">{filaEspera.length}</span>
                </div>
            </div>
            <div className="overflow-auto pe-1" style={{ maxHeight: '65vh' }}>
                {filaEspera.length === 0 && <div className="text-center text-muted py-4 small border rounded bg-white">Fila vazia</div>}
                {filaEspera.map(ticket => (
                <div key={ticket.idSenha} className="card border-0 shadow-sm mb-2 border-start border-4 border-warning">
                    <div className="card-body py-2">
                        <h4 className="fw-bold text-dark mb-0">{ticket.senha}</h4>
                        <small className="text-muted d-block" style={{fontSize: '0.75rem'}}>{ticket.prioridade}</small>
                    </div>
                </div>
                ))}
            </div>
          </div>

          {/* BOXES */}
          <div className="col-lg-8 col-md-12">
             <div className="row g-3">
                {BOXES.map(box => {
                    const activeTicket = senhas.find(s => s.status === 'EM_ATENDIMENTO' && Number(s.idGuicheAtendente) === box.id);
                    const isOcupado = !!activeTicket;
                    return (
                    <div key={box.id} className="col-md-3">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex align-items-center">
                                <i className={`bi bi-person-workspace me-2 ${isOcupado ? 'text-primary' : 'text-muted'}`}></i>
                                <span className={`fw-bold ${isOcupado ? 'text-dark' : 'text-muted'}`}>{box.name}</span>
                            </div>
                            <div className="card-body text-center d-flex flex-column justify-content-center py-4" style={{ minHeight: '140px' }}>
                                {activeTicket ? (
                                    <>
                                        <h2 className="display-5 fw-bold text-primary mb-0">{activeTicket.senha}</h2>
                                        <small className="text-muted mb-3">Chamada: {formatTime(activeTicket.dataEmissao)}</small>
                                        <button className="btn btn-outline-primary btn-sm w-75 mx-auto mt-auto" onClick={() => handleConcluirDireto(activeTicket.idSenha)}>Concluir</button>
                                    </>
                                ) : (
                                    <div className="text-muted opacity-50"><i className="bi bi-slash-circle fs-1 d-block mb-2"></i><span className="small text-uppercase fw-bold">Livre</span></div>
                                )}
                            </div>
                        </div>
                    </div>
                    );
                })}
             </div>
          </div>

          {/* FEITO */}
          <div className="col-lg-2 col-md-4">
            <div className="card border-0 shadow-sm mb-3">
                <div className="card-body d-flex justify-content-between align-items-center py-2">
                    <div className="d-flex align-items-center"><i className="bi bi-check-circle fs-5 text-success me-2"></i><span className="fw-bold text-dark">Feito</span></div>
                    <span className="badge bg-light text-success fs-6 border">{filaFeito.length}</span>
                </div>
            </div>
            <div className="overflow-auto pe-1" style={{ maxHeight: '65vh' }}>
                {filaFeito.map(ticket => (
                <div key={ticket.idSenha} className="card border-0 shadow-sm mb-2 opacity-75 bg-light">
                    <div className="card-body py-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="fw-bold text-secondary mb-0 text-decoration-line-through">{ticket.senha}</h6>
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>{formatTime(ticket.dataConclusao)}</small>
                        </div>
                        <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Guichê {ticket.idGuicheAtendente || '?'}</small>
                    </div>
                </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed-bottom bg-white border-top py-3 shadow-lg" style={{ zIndex: 1040 }}>
        <div className="container d-flex justify-content-center gap-3">
            <button className="btn btn-primary btn-lg px-4 fw-bold shadow-sm" onClick={() => setModalChamadaOpen(true)}><i className="bi bi-megaphone-fill me-2"></i> Chamar Senha</button>
            <button className="btn btn-warning text-white btn-lg px-4 fw-bold shadow-sm" onClick={() => { if (opcoesRechamar.length === 0) alert("Nenhuma senha ativa."); else setModalRechamarOpen(true); }}><i className="bi bi-arrow-repeat me-2"></i> Chamar Novamente</button>
            <button className="btn btn-outline-danger btn-lg px-4 fw-bold shadow-sm" onClick={() => opcoesDeletar.length > 0 ? setModalDeletarOpen(true) : alert("Nada para remover.")}><i className="bi bi-trash me-2"></i> Remover</button>
        </div>
      </div>

      <SelectionModal isOpen={modalChamadaOpen} onClose={() => setModalChamadaOpen(false)} title="Chamar para qual Guichê?" subtitle={`Próxima: ${proximaSenhaTexto}`} options={opcoesChamada} confirmText="Chamar" onConfirm={handleConfirmarChamada} />
      <SelectionModal isOpen={modalRechamarOpen} onClose={() => setModalRechamarOpen(false)} title="Chamar Novamente" subtitle="Escolha a senha:" options={opcoesRechamar} confirmText="Anunciar" onConfirm={handleConfirmarRechamada} />
      <SelectionModal isOpen={modalDeletarOpen} onClose={() => setModalDeletarOpen(false)} title="Remover Senha" subtitle="Selecione:" options={opcoesDeletar} confirmText="Remover" onConfirm={handleConfirmarDelecao} />
    </div>
  );
}

export default GerenciarSenhasEnfermeira;