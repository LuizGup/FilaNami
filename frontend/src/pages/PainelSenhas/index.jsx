import "./index.css";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { getAllSenhas } from "../../services/senhaService"; // Importe seu service
import CardUltimaSenha from "../../components/PainelComponents/CardUltimaSenha";

function PainelSenhas() {
  const [senhaAtual, setSenhaAtual] = useState(null);
  const [ultimasSenhas, setUltimasSenhas] = useState([]);

  // Função auxiliar para formatar os dados do backend para o visual do painel
  const formatarParaPainel = (dadosBackend) => {
    return {
      id: dadosBackend.idSenha,
      numero: dadosBackend.senha, // Ex: "C001"
      servico: dadosBackend.setorDestino, // Ex: "Triagem"
      local: `Guichê ${dadosBackend.idGuiche || dadosBackend.idGuicheAtendente || '??'}` // Ex: "Guichê 1"
    };
  };

  // Função para "Falar" a senha (Acessibilidade/Atenção)
  const anunciarSenha = (texto) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Busca inicial para não ficar tela preta se der F5
  const fetchDadosIniciais = async () => {
    try {
      // Pega quem já está sendo atendido agora
      const emAtendimento = await getAllSenhas({ status: 'EM_ATENDIMENTO' });
      
      if (emAtendimento && emAtendimento.length > 0) {
        // Pega o mais recente (o primeiro da lista, pois o backend ordena por dataEmissao DESC? 
        // Se o backend ordena DESC, o [0] é o ultimo chamado.
        // Vamos assumir que o [0] é o atual.
        const atual = emAtendimento[0];
        setSenhaAtual(formatarParaPainel(atual));

        // Pega os próximos 3 para preencher o histórico
        const historico = emAtendimento.slice(1, 4).map(formatarParaPainel);
        setUltimasSenhas(historico);
      }
    } catch (error) {
      console.error("Erro ao carregar painel:", error);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3000");

    fetchDadosIniciais();

    socket.on('senhaUpdate', (update) => {
      const { action, data } = update;

      // Só reage se for atualização de chamada (EM_ATENDIMENTO)
      if (action === 'update' && data.status === 'EM_ATENDIMENTO') {
        
        console.log("🔔 PAINEL: Nova chamada!", data);
        const novaSenhaFormatada = formatarParaPainel(data);

        setSenhaAtual((prevAtual) => {
          // 1. BLOQUEIO DE DUPLICIDADE IMEDIATA
          // Se a nova senha for IGUAL à que já está na tela, não faz nada.
          if (prevAtual && prevAtual.numero === novaSenhaFormatada.numero) {
            return prevAtual;
          }

          // Se tinha alguém na tela principal antes, move para o histórico
          if (prevAtual) {
            setUltimasSenhas((prevUltimas) => {
              // Adiciona a senha antiga no topo da lista
              const novaLista = [prevAtual, ...prevUltimas];

              // 2. FILTRAGEM DE DUPLICATAS (A Mágica acontece aqui)
              // Mantém apenas a PRIMEIRA ocorrência de cada número de senha
              const listaSemRepeticao = novaLista.filter((item, index, self) =>
                index === self.findIndex((t) => t.numero === item.numero)
              );

              // 3. Limita a 3 itens (para caber nas 3 colunas do seu layout)
              return listaSemRepeticao.slice(0, 3);
            });
          }

          // Toca o som / Fala a NOVA senha
          const textoFala = `Senha ${data.senha}, comparecer ao ${novaSenhaFormatada.local}`;
          anunciarSenha(textoFala);

          return novaSenhaFormatada;
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <section className="painel-container container-fluid bg-light vh-100 d-flex justify-content-center align-items-center">
      <div className="col-lg d-flex flex-column p-5">
        <div className="row mb-4">
          
          {/* BLOCO DA SENHA ATUAL */}
          <div className="col d-flex flex-column justify-content-center align-items-center mb-5">
            <h1 className="fw-bold text-secondary-emphasis text-start texto-senha-atual">
              Senha Atual
            </h1>
            <div className="senha-atual-card shadow-lg text-primary w-75 rounded-4 text-center fw-bold mt-3">
              {senhaAtual?.numero || "---"}
            </div>
          </div>

          {/* BLOCO DE INFORMAÇÕES (GUICHÊ/SETOR) */}
          <div className="col d-flex flex-column justify-content-center align-items-center mt-4">
            <div className="info-card-wrapper">
              <div className="info-card shadow-sm bg-primary text-white">
                {senhaAtual?.servico || "Aguardando..."}
              </div>
              <div className="info-card shadow-sm bg-primary text-white mt-3">
                {senhaAtual?.local || "..."}
              </div>
            </div>
          </div>
        </div>

        <hr />

        {/* BLOCO DAS ÚLTIMAS SENHAS */}
        <div className="col d-flex flex-column">
          <h2 className="fw-bold text-secondary-emphasis mt-4">
            Últimas senhas
          </h2>
          <div className="row g-3 mt-2">
            {ultimasSenhas.length > 0
              ? ultimasSenhas.map((senha, index) => (
                  <div className="col-4" key={senha.id || index}>
                    <CardUltimaSenha numero={senha.numero} />
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div className="col-4" key={i}>
                    <CardUltimaSenha numero="---" />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PainelSenhas;