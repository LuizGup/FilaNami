import { useState, useEffect } from 'react';

// Importa os serviços de API
// (Estou assumindo que seu serviço se chama 'senha.service.js'
// e está na pasta 'services', 3 níveis acima)
import {
  getAllSenhas,
  chamarProximaSenha,
  concluirSenha
} from '../../../services/senhaService';

// Importa os componentes (como no seu código original)
import NavbarFuncionario from "../../../components/FuncionarioComponents/NavbarFuncionario";
import CardSenha from "../../../components/FuncionarioComponents/CardSenha";

// Importa o CSS da página
import "./index.css";

// --- Componente Principal da Página ---
function GerenciarSenhas() {
  // Estado para armazenar as senhas da API
  const [senhas, setSenhas] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Never");

  // Função para buscar dados, movida para fora para ser reutilizável
  const fetchSenhas = async () => {
    try {
      const data = await getAllSenhas();
      setSenhas(data);
      setLastUpdated(new Date().toLocaleTimeString('pt-BR'));
      console.log("Senhas atualizadas:", data);
    } catch (error) {
      console.error("Erro ao buscar senhas:", error);
      // Aqui você pode adicionar um estado de erro para mostrar na UI
    }
  };

  // Hook para buscar os dados quando o componente carregar
  useEffect(() => {
    fetchSenhas();
  }, []); // O array vazio [] faz o useEffect rodar apenas uma vez (onMount)

  // --- Handlers de Ação ---
  const handleChamarProximo = async () => {
    try {
      const senhaChamada = await chamarProximaSenha();
      if (senhaChamada) {
        // Se a chamada foi bem-sucedida, atualiza a lista inteira.
        // (O WebSocket vai otimizar isso depois)
        await fetchSenhas();
      } else {
        // Tratar caso de não haver senhas (ex: mostrar um aviso)
        console.log("Nenhuma senha para chamar.");
      }
    } catch (error) {
      console.error("Erro no 'handleChamarProximo':", error);
    }
  };

  // Handler para concluir uma senha (clicando no card)
  const handleConcluir = async (idSenha) => {
    try {
      await concluirSenha(idSenha);
      await fetchSenhas(); // Atualiza a lista após concluir
    } catch (error) {
      console.error(`Erro ao concluir senha ${idSenha}:`, error);
    }
  };

  // Filtra as senhas por status para organizar nas colunas
  // Usa os valores do ENUM do Prisma
  const senhasEsperando = senhas.filter(
    (s) => s.status === "AGUARDANDO"
  );
  const senhasAtendimento = senhas.filter(
    (s) => s.status === "EM_ATENDIMENTO"
  );
  const senhasFeito = senhas.filter((s) => s.status === "CONCLUIDO");

  // Helper para formatar a hora (simplificado)
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

        {/* Container das Colunas Kanban (agora com 3 colunas) */}
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
                  // Senhas em espera não são clicáveis para concluir
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Em Atendimento (NOVA) */}
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
                    tempo={`Chamada: ${formatarHora(senha.dataEmissao)}`} // Idealmente seria dataAtualizacao
                    guicheLabel="Guichê:"
                    guicheValor={senha.idGuicheAtendente || '...'}
                    // Adiciona o clique para concluir
                    onClick={() => handleConcluir(senha.idSenha)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Feito */}
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
                  // Senhas feitas não são clicáveis
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Botões de Ação */}
      <div className="botoes-acao-container">
        {/* Adiciona o handler de clique */}
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