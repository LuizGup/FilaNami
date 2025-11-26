import React, { useState, useEffect, useCallback } from "react";
import CardSenha from "../../../components/admin/CardHistoricoSenhas/index.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllSenhasHistorico } from "../../../services/historicoService";
import "./index.css";

/**
 * Utilitários
 */
const formatTime = (isoString) => {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const mapStatusToFrontend = (status) => {
  const normalizedStatus = status ? status.toUpperCase() : "PENDENTE";

  let statusText;
  let statusClass;

  switch (normalizedStatus) {
    case "COMPLETADO":
    case "CONCLUIDO":
      statusText = "Concluído";
      statusClass =
        "bg-success bg-opacity-10 text-success border border-success border-opacity-25";
      break;
    case "CANCELADO":
    case "EXPIRADO":
      statusText = "Cancelado";
      statusClass =
        "bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25";
      break;
    case "EM_ATENDIMENTO":
      statusText = "Em Atendimento";
      statusClass =
        "bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25";
      break;
    case "AGUARDANDO":
    default:
      statusText = "Aguardando";
      statusClass =
        "bg-secondary bg-opacity-10 text-dark border border-secondary border-opacity-25";
      break;
  }

  return { statusText, statusClass };
};

const HistoricoSenhas = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistorico = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rawData = await getAllSenhasHistorico();

      const flattened = (Array.isArray(rawData) ? rawData : [])
        .map((item) => {
          const senhaData = item.senha ? item.senha : item;
          if (!senhaData) return null;

          const statusMap = mapStatusToFrontend(senhaData.status);

          return {
            id: senhaData.idSenha ?? `${senhaData.senha}-${Math.random()}`,
            passwordNumber: senhaData.senha,
            statusOriginal: senhaData.status
              ? senhaData.status.toUpperCase()
              : "AGUARDANDO",
            generationTime: formatTime(senhaData.dataEmissao),
            callTime: senhaData.dataConclusao
              ? formatTime(senhaData.dataConclusao)
              : "N/A",
            statusText: statusMap.statusText,
            statusClass: statusMap.statusClass,
            raw: senhaData,
          };
        })
        .filter(Boolean);

      setPasswords(flattened);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
      setError("Não foi possível carregar o histórico. Verifique o serviço de API.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistorico();
  }, [fetchHistorico]);

  // Filtro automático (SEM campo de busca)
  const filtered = passwords;

  const senhasAguardandoECancelado = filtered.filter(
    (p) =>
      p.statusOriginal !== "COMPLETADO" &&
      p.statusOriginal !== "CONCLUIDO" &&
      p.statusOriginal !== "EM_ATENDIMENTO"
  );

  const senhasEmAtendimento = filtered.filter(
    (p) => p.statusOriginal === "EM_ATENDIMENTO"
  );

  const senhasConcluidas = filtered.filter(
    (p) =>
      p.statusOriginal === "COMPLETADO" ||
      p.statusOriginal === "CONCLUIDO"
  );

  const renderColuna = (titulo, lista, corHeader) => (
    <div className="col-md-4">
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden h-100">
        <div className={`card-header text-white fw-bold ${corHeader} py-3 px-4`}>
          {titulo} <span className="badge bg-white text-dark ms-2">{lista.length}</span>
        </div>
        <div className="card-body p-0" style={{ maxHeight: "70vh", overflowY: "auto" }}>
          {lista.length === 0 ? (
            <div className="p-4 text-center text-muted small">Nenhum registro encontrado.</div>
          ) : (
            lista.map((password) => <CardSenha key={password.id} {...password} />)
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-2">Carregando histórico...</span>
      </div>
    );
  }

  if (error) {
    return <div className="p-5 text-center text-danger">Erro ao carregar: {error}</div>;
  }

  return (
    <div className="min-vh-100 bg-light d-flex flex-column">
      <header className="bg-white shadow-sm py-3 px-4 d-flex justify-content-between align-items-center border-bottom">
        <div className="d-flex align-items-center">
          <button
            className="btn btn-link text-decoration-none text-secondary fs-4 p-0 me-3 d-flex align-items-center"
            onClick={() => window.history.back()}
          >
            &larr;
          </button>
          <span className="fw-bold text-dark fs-5">Gerenciamento de Senhas - Histórico</span>
        </div>

        {/* REMOVIDO: campo de busca + botão atualizar */}
        <div className="bg-secondary rounded-circle" style={{ width: "40px", height: "40px" }} />
      </header>

      <main className="flex-grow-1 p-4 container-xl">
        <h1 className="h2 fw-bold text-dark mb-4">Visão Histórica por Status</h1>

        <div className="row g-4">
          {renderColuna("⏳ Aguardando / Cancelado", senhasAguardandoECancelado, "bg-secondary")}
          {renderColuna("▶️ Em Atendimento", senhasEmAtendimento, "bg-warning")}
          {renderColuna("✅ Concluído", senhasConcluidas, "bg-success")}
        </div>
      </main>
    </div>
  );
};

export default HistoricoSenhas;
