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
  const [senhas, setSenhas] = useState([]); // Inicia como array vazio
  const [lastUpdated, setLastUpdated] = useState("Never");

  // CORREÇÃO 1: fetchSenhas agora garante um array em caso de erro
  const fetchSenhas = async () => {
    try {
      const data = await getAllSenhas();
      
      // Garante que 'data' é um array antes de setar
      if (Array.isArray(data)) {
        setSenhas(data);
      } else {
        console.warn("A API não retornou um array. Setando array vazio.");
        setSenhas([]); // Garante que o estado é um array
      }
      setLastUpdated(new Date().toLocaleTimeString('pt-BR'));
      console.log("Senhas iniciais carregadas:", data);
    } catch (error) {
      console.error("Erro ao buscar senhas:", error);
      setSenhas([]); // Garante que o estado é um array mesmo em caso de erro
    }
  };

  // CORREÇÃO 2: useEffect agora lida com 'delete' e valida o 'update'
  useEffect(() => {
    // 1. Conecta ao socket QUANDO o componente monta
    const socket = io("http://localhost:3000"); 

    // 2. Busca os dados iniciais
    fetchSenhas();

    // 3. Define o handler de atualização (COMPLETO)
    const handleSenhaUpdate = (update) => {
      
      // Validação: Garante que o update é válido
      if (!update || !update.action || !update.data) {
        console.warn("Socket: Recebeu evento 'senhaUpdate' malformado:", update);
        return; // Ignora o evento
      }

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

      // Adiciona o 'delete' que estava faltando
      if (action === 'delete') {
        setSenhas(prevSenhas =>
          prevSenhas.filter(s => s.idSenha !== data.idSenha)
        );
      }
    };

    // 4. Começa a "escutar" o evento
    socket.on('senhaUpdate', handleSenhaUpdate);

    // 5. FUNÇÃO DE LIMPEZA
    return () => {
      console.log("Desconectando socket...");
      socket.off('senhaUpdate', handleSenhaUpdate); // Remove o listener
      socket.disconnect(); // Desconecta o socket
    };
  }, []); // O array vazio [] garante que isso rode apenas uma vez por montagem


  // Handlers (não precisam mais do fetchSenhas)
  const handleChamarProximo = async () => {
    try {
      // O backend vai emitir o 'senhaUpdate'
      await chamarProximaSenha(); 
    } catch (error) {
      console.error("Erro no 'handleChamarProximo':", error);
    }
  };

  const handleConcluir = async (idSenha) => {
    try {
      // O backend vai emitir o 'senhaUpdate'
      await concluirSenha(idSenha);
    } catch (error) {
      console.error(`Erro ao concluir senha ${idSenha}:`, error);
    }
  };

  // --- Filtros (Agora são seguros, pois 'senhas' é sempre um array) ---

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