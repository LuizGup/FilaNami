import { useState, useEffect } from 'react';
import { io } from "socket.io-client"; // Importa o socket.io-client

import {
  getAllSenhas,
  chamarProximaSenha,
  concluirSenha
} from '../../../services/senhaService';

import NavbarFuncionario from "../../../components/FuncionarioComponents/NavbarFuncionario";
import CardSenha from "../../../components/FuncionarioComponents/CardSenha";

import "./index.css";

function GerenciarSenhas() {
  const [senhas, setSenhas] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Never");

  const fetchSenhas = async () => {
    try {
      const data = await getAllSenhas();
      setSenhas(data);
      setLastUpdated(new Date().toLocaleTimeString('pt-BR'));
      console.log("Senhas iniciais carregadas:", data);
    } catch (error) {
      console.error("Erro ao buscar senhas:", error);
    }
  };

  // useEffect ATUALIZADO (A SOLUÇÃO ESTÁ AQUI)
  useEffect(() => {
    // 1. Conecta ao socket QUANDO o componente monta
    const socket = io("http://localhost:3000"); 

    // 2. Busca os dados iniciais
    fetchSenhas();

    // 3. Define o handler de atualização
    const handleSenhaUpdate = (update) => {
      const { action, data } = update;
      console.log("Socket: Recebeu evento 'senhaUpdate'", update);

      if (action === 'create') {
        setSenhas(prevSenhas => [...prevSenhas, data]);
      }
      
      if (action === 'update') {
        setSenhas(prevSenhas =>
          prevSenhas.map(s => (s.idSenha === data.idSenha ? data : s))
        );
      }
    };

    // 4. Começa a "escutar" o evento
    socket.on('senhaUpdate', handleSenhaUpdate);

    // 5. FUNÇÃO DE LIMPEZA (A MÁGICA)
    // Isso roda quando o componente "desmonta" (ou recarrega no dev)
    return () => {
      console.log("Desconectando socket...");
      socket.off('senhaUpdate', handleSenhaUpdate); // Remove o listener
      socket.disconnect(); // Desconecta o socket
    };
  }, []); // O array vazio [] garante que isso rode apenas uma vez por montagem


  // Handlers (sem 'fetchSenhas')
  const handleChamarProximo = async () => {
    try {
      await chamarProximaSenha();
    } catch (error) {
      console.error("Erro no 'handleChamarProximo':", error);
    }
  };

  const handleConcluir = async (idSenha) => {
    try {
      await concluirSenha(idSenha);
    } catch (error) {
      console.error(`Erro ao concluir senha ${idSenha}:`, error);
    }
  };

  // --- O resto do seu componente (filtros e JSX) permanece o mesmo ---

  const senhasEsperando = senhas.filter(
    (s) => s.status === "AGUARDANDO"
  );
  const senhasAtendimento = senhas.filter(
    (s) => s.status === "EM_ATENDIMENTO"
  );
  const senhasFeito = senhas.filter((s) => s.status === "CONCLUIDO");

  const formatarHora = (dataString) => {
    if (!dataString) return '-';
    return new Date(dataString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <section className="gerenciar-senhas-container">
      <NavbarFuncionario />

      <div className="container-fluid mt-4" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Status Senha</h2>
          <span className="last-updated">Real-time updates enabled</span>
        </div>

        <div className="row g-4">

          {/* Coluna Esperando */}
          <div className="col-md-4">
            <div className="senha-coluna">
              <div className="coluna-header esperando">
                <span>🏆 Esperando</span>
                <span className="coluna-count">{senhasEsperando.length}</span>
              </div>
              <div className="coluna-body">
                {senhasEsperando.map((senha) => (
                  <CardSenha
                    key={senha.idSenha}
                    numero={senha.senha}
                    status={senha.status}
                    tempo={`Emitida: ${formatarHora(senha.dataEmissao)}`}
                    guicheLabel="Setor Destino:"
                    guicheValor={senha.setorDestino}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Em Atendimento */}
          <div className="col-md-4">
            <div className="senha-coluna">
              <div className="coluna-header em-atendimento">
                <span>▶️ Em Atendimento</span>
                <span className="coluna-count">{senhasAtendimento.length}</span>
              </div>
              <div className="coluna-body">
                {senhasAtendimento.map((senha) => (
                  <CardSenha
                    key={senha.idSenha}
                    numero={senha.senha}
                    status={senha.status}
                    tempo={`Chamada: ${formatarHora(senha.dataEmissao)}`}
                    guicheLabel="Guichê:"
                    guicheValor={senha.idGuicheAtendente || '...'}
                    onClick={() => handleConcluir(senha.idSenha)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Feito */}
          <div className="col-md-4">
            <div className="senha-coluna">
              <div className="coluna-header feito">
                <span>✅ Feito</span>
                <span className="coluna-count">{senhasFeito.length}</span>
              </div>
              <div className="coluna-body">
                {senhasFeito.map((senha) => (
                  <CardSenha
                    key={senha.idSenha}
                    numero={senha.senha}
                    status={senha.status}
                    tempo={`Concluída: ${formatarHora(senha.dataConclusao)}`}
                    guicheLabel="Guichê"
                    guicheValor={senha.idGuicheAtendente || 'N/A'}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="botoes-acao-container">
        <button
          className="btn btn-acao-primary"
          onClick={handleChamarProximo}
        >
          Chamar Próximo
        </button>
        <button className="btn btn-acao-secondary">Chamar Novamente</button>
      </div>
    </section>
  );
}

export default GerenciarSenhas;