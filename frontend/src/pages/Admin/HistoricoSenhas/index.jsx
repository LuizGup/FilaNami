import React, { useState, useEffect, useCallback } from "react";
import CardSenha from "../../../components/admin/CardHistoricoSenhas/index.jsx";
import { getAllSenhasHistorico } from "../../../services/historicoService";
import { exportSenhasToPDF } from "../../../utils/pdfExporter"; 
import "./index.css";

// ----------------------------------------------------
// FUNÇÕES AUXILIARES
// ----------------------------------------------------
const formatTime = (dateString) => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-"; 
    
    return new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    return "-";
  }
};

const mapStatusToFrontend = (status) => {
  const normalizedStatus = status ? status.toUpperCase() : "PENDENTE";
  let statusText = "Pending";
  let statusClass = "status-pending";

  if (["COMPLETADO", "CONCLUIDO", "FINALIZADO"].includes(normalizedStatus)) {
    statusText = "Completed";
    statusClass = "status-completed";
  } else if (["CANCELADO", "EXPIRADO"].includes(normalizedStatus)) {
    statusText = "Cancelled";
    statusClass = "status-cancelled";
  }
  
  return { statusText, statusClass };
};

// ----------------------------------------------------
// COMPONENTE PRINCIPAL
// ----------------------------------------------------
const HistoricoSenhas = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistorico = useCallback(async () => {
    setLoading(true);
    try {
      const rawData = await getAllSenhasHistorico();
      
      const arrayData = Array.isArray(rawData) ? rawData : (rawData.content || []);

      arrayData.sort((a, b) => {
          const dateA = new Date(a.senha?.dataEmissao || a.dataEmissao || 0);
          const dateB = new Date(b.senha?.dataEmissao || b.dataEmissao || 0);
          return dateB - dateA; 
      });

      const formattedData = arrayData.map((item, index) => {
        const dados = item.senha ? item.senha : item;
        
        if (!dados) return null;

        const numeroSenha = dados.senha || dados.numero || "---";
        const dataGeracao = dados.dataEmissao || dados.data_emissao || dados.createdAt;
        const dataChamada = dados.dataConclusao || dados.data_conclusao || dados.updatedAt;
        const statusItem = dados.status;

        const { statusText, statusClass } = mapStatusToFrontend(statusItem);

       return {
         id: dados.id || dados.idSenha || index,
         passwordNumber: numeroSenha, 
         generationTime: formatTime(dataGeracao),
         callTime: formatTime(dataChamada),
         statusText,
         statusClass,
        };
      }).filter(Boolean);

      setPasswords(formattedData);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistorico();
  }, [fetchHistorico]);

  // ----------------------------------------------------
  // ADIÇÃO — FUNÇÃO QUE EXPORTA PDF
  // ----------------------------------------------------
  const handleExportPDF = () => {
    if (passwords.length === 0) {
        console.warn("Nenhum dado para exportar.");
        return;
    }

    // 🔥 PASSANDO O SEU OBJETO JÁ FORMATADO
    exportSenhasToPDF(passwords);
  };

  return (
    <div className="historico-page-container">
      <header className="page-header">
        <div className="left-header-section">
          <button className="return-button-top" onClick={() => window.history.back()}>
            <i className="bi bi-arrow-left"></i>
          </button>
          
          <div className="logo-section">
            <span className="app-name">Gerenciamento de Senhas</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="page-title mb-0" style={{ fontSize: '1.5rem' }}>Histórico De Senhas</h1>
          
          <button 
            className="btn btn-sm text-white d-flex align-items-center gap-2"
            onClick={handleExportPDF}
            disabled={loading || passwords.length === 0}
            style={{ 
                backgroundColor: '#13A4EC', 
                borderColor: '#13A4EC',
                borderRadius: '6px',
                padding: '8px 16px',
                fontWeight: '500'
            }}
          >
             Exportar PDF
          </button>

        </div>
        
        <div className="password-list-wrapper">
          <div className="list-header" style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr 1fr', 
              padding: '15px 20px',
              borderBottom: '1px solid #eee',
              color: '#999',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
            <div>PASSWORD NUMBER</div>
            <div>GENERATION TIME</div>
            <div>CALL TIME</div>
            <div>STATUS</div>
          </div>

          <div className="list-body">
            {loading ? (
              <div className="p-4 text-center">Carregando...</div>
            ) : passwords.length === 0 ? (
               <div className="p-4 text-center text-muted">Nenhum registro encontrado.</div>
            ) : (
              passwords.map((pass) => (
                <CardSenha 
                  key={pass.id}
                  passwordNumber={pass.passwordNumber}
                  generationTime={pass.generationTime}
                  callTime={pass.callTime}
                  statusText={pass.statusText}
                  statusClass={pass.statusClass}
                />
              ))
            )}
          </div>
          
           <div className="p-3 text-muted small border-top">
              Showing 1 to {passwords.length} entries
           </div>
        </div>
      </main>
    </div>
  );
};

export default HistoricoSenhas;
