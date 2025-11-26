import { useState, useEffect, useCallback } from 'react';
import { io } from "socket.io-client";
import {
  getAllSenhas,
  chamarProximaSenha,
  concluirSenha,
  getHistoricoDoGuiche,
  deleteSenha
} from '../../../services/senhaService';

import NavbarFuncionario from "../../../components/FuncionarioComponents/NavbarFuncionario";
import CardSenha from "../../../components/FuncionarioComponents/CardSenha";

import "./index.css";

function GerenciarSenhas() {
  const [senhas, setSenhas] = useState([]);
  const [historicoBanco, setHistoricoBanco] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Carregando...");
  const [loading, setLoading] = useState(false);

  // ID da senha selecionada para deletar
  const [selectedSenhaId, setSelectedSenhaId] = useState(null);

  const MEU_GUICHE_ID = 1;
  const MEU_USUARIO_ID = 1;
  const MEU_SETOR = "Atendimento";

  // ================== BUSCAR LISTA =====================
  const fetchSenhas = useCallback(async () => {
    try {
      const data = await getAllSenhas();
      setSenhas(data || []);
      setLastUpdated(new Date().toLocaleTimeString("pt-BR"));
    } catch (error) {
      console.error("Erro ao buscar senhas:", error);
    }
  }, []);

  const fetchHistorico = useCallback(async () => {
    try {
      const data = await getHistoricoDoGuiche(MEU_GUICHE_ID);
      setHistoricoBanco(data || []);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    }
  }, []);

  // ================== SOCKET =====================
  useEffect(() => {
    const socket = io("http://localhost:3000");

    fetchSenhas();
    fetchHistorico();

    socket.on("senhaUpdate", ({ action }) => {
      fetchSenhas();

      if (action === "update") {
        setTimeout(() => fetchHistorico(), 200);
      }
    });

    return () => socket.disconnect();
  }, [fetchSenhas, fetchHistorico]);

  // ================== AÇÕES =====================
  const handleChamarProximo = async () => {
    if (loading) return;

    if (senhaAtualMesa.length > 0) {
      alert("⚠️ Finalize o atendimento atual antes de chamar o próximo!");
      return;
    }

    setLoading(true);
    try {
      await chamarProximaSenha(MEU_GUICHE_ID, MEU_SETOR, MEU_USUARIO_ID);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      alert("Erro: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletarSenha = async (idSenha) => {
    if (loading) return;

    if (!idSenha) {
      alert("⚠️ Nenhuma senha selecionada para deletar!");
      return;
    }

    if (!confirm("❗ Confirmar exclusão desta senha?")) return;

    setLoading(true);
    try {
      await deleteSenha(idSenha);
      alert("Senha deletada! ✔");
      fetchSenhas();
      setSelectedSenhaId(null);
    } catch (error) {
      alert("Erro: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleConcluir = async (senha) => {
    if (loading) return;

    setLoading(true);
    try {
      await concluirSenha(senha.idSenha);

      const ehConclusaoReal = senha.setorDestino === MEU_SETOR;

      if (ehConclusaoReal) {
        setTimeout(() => fetchHistorico(), 200);
      }
    } catch (error) {
      alert("Erro: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const formatarHora = (data) =>
    data
      ? new Date(data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      : "-";

  // ================== FILTROS =====================
  const senhasEsperando = senhas.filter(
    (s) => s.status === "AGUARDANDO" && s.setorAtual === MEU_SETOR
  );

  const senhaAtualMesa = senhas.filter(
    (s) => s.status === "EM_ATENDIMENTO" && Number(s.idGuicheAtendente) === MEU_GUICHE_ID
  );

  const listaFeito = historicoBanco.filter(
    (h) => !senhaAtualMesa.some((a) => a.idSenha === h.idSenha)
  );

  return (
    <section className="gerenciar-senhas-container">
      <NavbarFuncionario />

      <div className="container-fluid mt-4 px-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2>Gerenciamento de Atendimento</h2>
            <small className="text-muted">Guichê {MEU_GUICHE_ID} • {MEU_SETOR}</small>
          </div>
          <span className="last-updated badge bg-light text-dark border p-2">
            Atualizado: {lastUpdated}
          </span>
        </div>

        <div className="row g-4">

          {/* 1. ESPERANDO */}
          <div className="col-md-4">
            <div className="senha-coluna">
              <div className="coluna-header esperando">
                <span>🏆 Fila de Espera</span>
                <span>{senhasEsperando.length}</span>
              </div>

              <div className="coluna-body">
                {senhasEsperando.length === 0 && (
                  <p className="text-center mt-5 text-muted small">Ninguém na fila 🎉</p>
                )}

                {senhasEsperando.map((senha) => (
                  <div
                    key={senha.idSenha}
                    onClick={() => setSelectedSenhaId(senha.idSenha)}
                    className={
                      "selectable-item " +
                      (selectedSenhaId === senha.idSenha ? "item-selecionado" : "")
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <CardSenha
                      numero={senha.senha}
                      status={senha.status}
                      tempo={`Chegou: ${formatarHora(senha.dataEmissao)}`}
                      guicheLabel="Destino:"
                      guicheValor={senha.setorDestino}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. EM ATENDIMENTO */}
          <div className="col-md-4">
            <div className="senha-coluna border-primary">
              <div className="coluna-header em-atendimento">
                ▶ Em Atendimento <span>{senhaAtualMesa.length}</span>
              </div>

              <div className="coluna-body">
                {senhaAtualMesa.length === 0 ? (
                  <div className="text-center text-muted mt-5">Guichê Livre</div>
                ) : (
                  senhaAtualMesa.map((senha) => (
                    <div key={senha.idSenha}>
                      <CardSenha
                        numero={senha.senha}
                        status={senha.status}
                        tempo={`Chamada: ${formatarHora(senha.dataEmissao)}`}
                        guicheLabel="Prioridade:"
                        guicheValor={senha.prioridade}
                      />

                      <button
                        className="btn btn-success w-100 mt-2"
                        onClick={() => handleConcluir(senha)}
                        disabled={loading}
                      >
                        {senha.setorDestino !== MEU_SETOR
                          ? `Encaminhar para ${senha.setorDestino}`
                          : "Concluir Atendimento"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 3. HISTÓRICO */}
          <div className="col-md-4">
            <div className="senha-coluna">
              <div className="coluna-header feito">
                <span>✅ Meus Atendimentos</span>
                <span>{listaFeito.length}</span>
              </div>

              <div className="coluna-body">
                {listaFeito.map((senha) => (
                  <CardSenha
                    key={senha.idSenha}
                    numero={senha.senha}
                    status="CONCLUIDO"
                    tempo={`Fim: ${formatarHora(senha.dataConclusao)}`}
                    guicheLabel="Guichê:"
                    guicheValor={MEU_GUICHE_ID}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTÕES */}
      <div className="botoes-acao-container mt-4">
        <button
          className="btn btn-acao-primary"
          onClick={handleChamarProximo}
          disabled={loading || senhaAtualMesa.length > 0}
        >
          Chamar Próximo
        </button>

        <button className="btn btn-acao-secondary" disabled={loading}>
          Chamar Novamente
        </button>

        <button
          className="btn btn-acao-danger"
          onClick={() => handleDeletarSenha(selectedSenhaId)}
          disabled={loading || !selectedSenhaId}
        >
          Deletar Senha
        </button>
      </div>
    </section>
  );
}

export default GerenciarSenhas;
