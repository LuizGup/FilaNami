import { useState, useEffect } from 'react';

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
      console.log("Senhas atualizadas:", data);
    } catch (error) {
      console.error("Erro ao buscar senhas:", error);
    }
  };

  useEffect(() => {
    fetchSenhas();
  }, []); 


  const handleChamarProximo = async () => {
    try {
      const senhaChamada = await chamarProximaSenha();
      if (senhaChamada) {
        await fetchSenhas();
      } else {
        console.log("Nenhuma senha para chamar.");
      }
    } catch (error) {
      console.error("Erro no 'handleChamarProximo':", error);
    }
  };

  const handleConcluir = async (idSenha) => {
    try {
      await concluirSenha(idSenha);
      await fetchSenhas();
    } catch (error) {
      console.error(`Erro ao concluir senha ${idSenha}:`, error);
    }
  };

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
          <span className="last-updated">Last updated: {lastUpdated}</span>
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

          <div className="col-col-md-4">
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
        <button className="btn btn-acao-danger">Remover Senha</button>
      </div>
    </section>
  );
}

export default GerenciarSenhas;