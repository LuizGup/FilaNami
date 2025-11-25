import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
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
  
  // NOVO ESTADO: Histórico Local (Alimenta a coluna "Feito")
  // Isso guarda as senhas que saíram da tela, independente do status no banco.
  const [historicoLocal, setHistoricoLocal] = useState([]);
  
  const [lastUpdated, setLastUpdated] = useState("Carregando...");

  const MEU_GUICHE_ID = 1; 
  const MEU_SETOR = "Atendimento"; 

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

    const handleSenhaUpdate = (update) => {
      const { action, data } = update;
      
      setSenhas(prevSenhas => {
        if (action === 'delete') return prevSenhas.filter(s => s.idSenha !== data.idSenha);

        if (action === 'update') {
            const existe = prevSenhas.some(s => s.idSenha === data.idSenha);
            return existe 
                ? prevSenhas.map(s => s.idSenha === data.idSenha ? data : s)
                : [...prevSenhas, data];
        }

        if (action === 'createSenha') {
             const existe = prevSenhas.some(s => s.idSenha === data.idSenha);
             if (existe) return prevSenhas;
             return [...prevSenhas, data];
        }

        return prevSenhas;
      });
      
      setLastUpdated(new Date().toLocaleTimeString('pt-BR'));
    };

    socket.on('senhaUpdate', handleSenhaUpdate);

    return () => {
      socket.off('senhaUpdate', handleSenhaUpdate);
      socket.disconnect();
    };
  }, []);

  // --- A LÓGICA DO ARRASTAR VISUAL ---
  const handleChamarProximo = async () => {
    try {
      // 1. Identifica quem está na mesa AGORA (antes de chamar o novo)
      const senhaAnterior = senhas.find(s => 
        s.status === 'EM_ATENDIMENTO' && 
        Number(s.idGuicheAtendente) === MEU_GUICHE_ID
      );

      // 2. Joga ela para o histórico VISUAL (Arrasta para a direita)
      // Nota: Não chamamos concluirSenha no banco.
      if (senhaAnterior) {
          setHistoricoLocal(prev => [senhaAnterior, ...prev]);
      }

      // 3. Chama o próximo
      await chamarProximaSenha(MEU_GUICHE_ID, MEU_SETOR);
      
      // O Socket vai trazer a nova senha e colocar na coluna "Em Atendimento"
      // Como o banco agora tem DUAS senhas em atendimento para o mesmo guichê (a velha e a nova),
      // precisamos filtrar visualmente qual mostramos na coluna do meio (veja abaixo).

    } catch (error) {
      console.error("Erro ao chamar:", error);
      alert("Erro: " + (error.response?.data?.message || error.message));
    }
  };

  // Se precisar concluir manualmente depois, esse botão ainda existe
  const handleConcluir = async (idSenha) => {
    try {
        await concluirSenha(idSenha);
        // Atualiza também no histórico local para refletir status se quiser
        setHistoricoLocal(prev => prev.map(s => s.idSenha === idSenha ? { ...s, status: 'CONCLUIDO' } : s));
    } catch (error) {
        console.error(error);
    }
  };

  // --- FILTROS VISUAIS ---

const senhasEsperando = senhas.filter(s => s.status === "AGUARDANDO");

  // 1. Montamos a lista de FEITO primeiro
  const senhasBancoConcluidas = senhas.filter(s => s.status === "CONCLUIDO");
  
  // Unimos o histórico local com o do banco (removendo duplicatas de ID)
  const listaFeitoVisual = [
      ...historicoLocal, 
      ...senhasBancoConcluidas
  ].filter((v, i, a) => a.findIndex(t => t.idSenha === v.idSenha) === i); 

  // 2. Agora montamos a lista de ATENDIMENTO filtrando o que já está no feito
  const todasAtendimento = senhas
    .filter(s => s.status === "EM_ATENDIMENTO")
    // AQUI ESTÁ A CORREÇÃO:
    // Se a senha já está na lista visual de "Feito", não mostre ela no "Atendimento"
    .filter(ativo => !listaFeitoVisual.some(feito => feito.idSenha === ativo.idSenha))
    .sort((a, b) => new Date(b.dataEmissao) - new Date(a.dataEmissao));

  // Pegamos a primeira (a atual)
  const senhaAtualMesa = todasAtendimento.length > 0 ? [todasAtendimento[0]] : [];
  
  const formatarHora = (dataString) => {
    if (!dataString) return '-';
    return new Date(dataString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <section className="gerenciar-senhas-container">
      <NavbarFuncionario />

      <div className="container-fluid mt-4 px-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Status Senha</h2>
          <span className="last-updated">{`Atualizado: ${lastUpdated}`}</span>
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

          {/* Coluna Em Atendimento (Mostra só a mais recente) */}
          <div className="col-md-4">
            <div className="senha-coluna">
              <div className="coluna-header em-atendimento">
                <span>▶️ Em Atendimento</span>
                <span className="coluna-count">{senhaAtualMesa.length}</span>
              </div>
              <div className="coluna-body">
                {senhaAtualMesa.map((senha) => (
                  <CardSenha
                    key={senha.idSenha}
                    numero={senha.senha}
                    status={senha.status} // Vai mostrar EM_ATENDIMENTO
                    tempo={`Chamada: ${formatarHora(senha.dataEmissao)}`}
                    guicheLabel="Guichê:"
                    guicheValor={senha.idGuicheAtendente || MEU_GUICHE_ID}
                    // Botão opcional se quiser concluir de verdade no banco
                    onClick={() => handleConcluir(senha.idSenha)} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Feito (Histórico Visual + Banco) */}
          <div className="col-md-4">
            <div className="senha-coluna">
              <div className="coluna-header feito">
                <span>✅ Histórico / Feito</span>
                <span className="coluna-count">{listaFeitoVisual.length}</span>
              </div>
              <div className="coluna-body">
                {listaFeitoVisual.map((senha) => (
                  <CardSenha
                    key={senha.idSenha}
                    numero={senha.senha}
                    // Visualmente parece concluido, mas pode estar EM_ATENDIMENTO no banco
                    status="HISTORICO" 
                    tempo={`Fim: ${formatarHora(new Date())}`} // Hora aproximada
                    guicheLabel="Guichê:"
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