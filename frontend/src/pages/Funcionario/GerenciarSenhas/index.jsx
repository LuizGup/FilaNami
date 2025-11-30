import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback, useContext } from 'react';
import { io } from "socket.io-client";
import {
  getAllSenhas,
  chamarProximaSenha,
  concluirSenha,
  getHistoricoDoGuiche,
  deleteSenha
} from '../../../services/senhaService';
import { AuthContext } from "../../../contexts/AuthContext";
import NavbarFuncionario from "../../../components/FuncionarioComponents/NavbarFuncionario";
import CardSenha from "../../../components/FuncionarioComponents/CardSenha";
import "./index.css";

function GerenciarSenhas() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [senhas, setSenhas] = useState([]);
  const [historicoBanco, setHistoricoBanco] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Carregando...");
  const [loading, setLoading] = useState(false);
  const [selectedSenhaId, setSelectedSenhaId] = useState(null);
  
  // Canal de Rádio
  const [radioChannel, setRadioChannel] = useState(null);

  const MEU_USUARIO_ID = user?.id || null; 
  const MEU_SETOR = "Atendimento";

  const fetchSenhas = useCallback(async () => {
    try {
      const data = await getAllSenhas();
      setSenhas(data);
      setLastUpdated(new Date().toLocaleTimeString("pt-BR"));
    } catch (error) {
      console.error("Erro senhas:", error);
    }
  }, []);

  const fetchHistorico = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getHistoricoDoGuiche(id);
      setHistoricoBanco(data || []);
    } catch (error) {
      console.error("Erro histórico:", error);
    }
  }, [id]);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    
    // Inicia o Rádio
    const channel = new BroadcastChannel('fila_nami_channel');
    setRadioChannel(channel);

    fetchSenhas();
    fetchHistorico();

    socket.on("senhaUpdate", ({ action }) => {
      fetchSenhas();
      if (action === "update") setTimeout(() => fetchHistorico(), 200);
    });

    return () => {
      socket.disconnect();
      channel.close();
    };
  }, [fetchSenhas, fetchHistorico]);

  // Filtros
  const senhasEsperando = senhas.filter(s => s.status === "AGUARDANDO" && s.setorAtual === MEU_SETOR);
  const senhaAtualMesa = senhas.filter(s => s.status === "EM_ATENDIMENTO" && Number(s.idGuicheAtendente) === Number(id));
  const listaFeito = historicoBanco.filter(h => !senhaAtualMesa.some(a => a.idSenha === h.idSenha));

  // --- AÇÕES ---

  const handleChamarProximo = async () => {
    if (loading) return;
    if (senhaAtualMesa.length > 0) {
      alert("⚠️ Finalize o atendimento atual!");
      return;
    }
    setLoading(true);
    try {
      await chamarProximaSenha(Number(id), MEU_SETOR, MEU_USUARIO_ID);
    } catch (error) {
      alert("Erro: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // --- CHAMAR NOVAMENTE (VIA RÁDIO) ---
  const handleChamarNovamente = () => {
    const senhaNaMesa = senhaAtualMesa[0];
    if (!senhaNaMesa) {
      alert("⚠️ Ninguém na mesa!");
      return;
    }

    if (radioChannel) {
        // Envia mensagem direta para a aba do Painel
        radioChannel.postMessage({
            type: 'CHAMAR_NOVAMENTE',
            payload: senhaNaMesa
        });
        // Feedback visual sutil (console ou toast seria melhor, mas alert serve)
        // alert(`Sinal enviado: Senha ${senhaNaMesa.senha}`); 
    } else {
        alert("Erro no canal de comunicação.");
    }
  };

  const handleDeletarSenha = async () => {
    if (loading) return;
    const senhaNaMesa = senhaAtualMesa[0];
    if (!senhaNaMesa) {
      alert("⚠️ Nada para cancelar!");
      return;
    }

    if (!confirm(`❗ Cancelar e excluir a senha ${senhaNaMesa.senha}?`)) return;

    setLoading(true);
    try {
      await deleteSenha(senhaNaMesa.idSenha);
      alert("Cancelado!");
      fetchSenhas();
    } catch (error) {
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConcluir = async (senha) => {
    if (loading) return;
    setLoading(true);
    try {
      await concluirSenha(senha.idSenha);
      if (senha.setorDestino === MEU_SETOR) setTimeout(() => fetchHistorico(), 200);
    } catch (error) {
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatarHora = (data) => data ? new Date(data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "-";

  return (
    <section className="gerenciar-senhas-container">
      <NavbarFuncionario />
      <div className="container-fluid mt-4 px-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2>Gerenciamento de Atendimento</h2>
            <small className="text-muted fw-bold">Operando Guichê {id} • {MEU_SETOR}</small>
          </div>
          <span className="last-updated badge bg-light text-dark border p-2">Atualizado: {lastUpdated}</span>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="senha-coluna">
              <div className="coluna-header esperando">
                <span>🏆 Fila de Espera</span>
                <span>{senhasEsperando.length}</span>
              </div>
              <div className="coluna-body">
                {senhasEsperando.map((senha) => (
                  <div key={senha.idSenha} onClick={() => setSelectedSenhaId(senha.idSenha)} className={"selectable-item " + (selectedSenhaId === senha.idSenha ? "item-selecionado" : "")} style={{ cursor: "pointer" }}>
                    <CardSenha numero={senha.senha} status={senha.status} tempo={`Chegou: ${formatarHora(senha.dataEmissao)}`} guicheLabel="Destino:" guicheValor={senha.setorDestino} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="senha-coluna border-primary">
              <div className="coluna-header em-atendimento">
                ▶ Meu Atendimento <span>{senhaAtualMesa.length}</span>
              </div>
              <div className="coluna-body">
                {senhaAtualMesa.length === 0 ? (
                  <div className="text-center text-muted mt-5">
                    <i className="bi bi-person-workspace display-4 d-block mb-3"></i>
                    Guichê Livre
                  </div>
                ) : (
                  senhaAtualMesa.map((senha) => (
                    <div key={senha.idSenha}>
                      <CardSenha numero={senha.senha} status={senha.status} tempo={`Chamada: ${formatarHora(senha.dataEmissao)}`} guicheLabel="Prioridade:" guicheValor={senha.prioridade} />
                      <button className="btn btn-success w-100 mt-2" onClick={() => handleConcluir(senha)} disabled={loading}>
                        {senha.setorDestino !== MEU_SETOR ? `Encaminhar para ${senha.setorDestino}` : "Concluir Atendimento"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="senha-coluna">
              <div className="coluna-header feito">
                <span>✅ Meus Atendimentos</span>
                <span>{listaFeito.length}</span>
              </div>
              <div className="coluna-body">
                {listaFeito.map((senha) => (
                  <CardSenha key={senha.idSenha} numero={senha.senha} status="CONCLUIDO" tempo={`Fim: ${formatarHora(senha.dataConclusao)}`} guicheLabel="Guichê:" guicheValor={id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="botoes-acao-container mt-4">
        <button className="btn btn-acao-primary" onClick={handleChamarProximo} disabled={loading || senhaAtualMesa.length > 0}>
          Chamar Próximo (Guichê {id})
        </button>

        <button className="btn btn-acao-secondary" onClick={handleChamarNovamente} disabled={loading || senhaAtualMesa.length === 0}>
          Chamar Novamente
        </button>

        <button className="btn btn-acao-danger" onClick={handleDeletarSenha} disabled={loading || senhaAtualMesa.length === 0}>
          Cancelar Atendimento
        </button>
      </div>
    </section>
  );
}

export default GerenciarSenhas;