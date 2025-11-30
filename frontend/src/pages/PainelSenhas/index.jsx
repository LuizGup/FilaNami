import "./index.css";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { getAllSenhas } from "../../services/senhaService"; 
import CardUltimaSenha from "../../components/PainelComponents/CardUltimaSenha";

function PainelSenhas() {
  const [senhaAtual, setSenhaAtual] = useState(null);
  const [ultimasSenhas, setUltimasSenhas] = useState([]);
  
  const isSpeakingRef = useRef(false);

  const formatarParaPainel = (dadosBackend) => {
    return {
      id: dadosBackend.idSenha,
      numero: dadosBackend.senha,
      // Aqui está o segredo: ele aceita o dado forçado pela enfermeira
      servico: dadosBackend.setorAtual || dadosBackend.setorDestino,
      local: `Guichê ${dadosBackend.idGuiche || dadosBackend.idGuicheAtendente || '??'}`
    };
  };

  const anunciarSenha = (texto) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      setTimeout(() => { window.speechSynthesis.speak(utterance); }, 50);
    }
  };

  const processarNovaSenha = (dadosSenha, forcarAudio = false) => {
      const novaSenhaFormatada = formatarParaPainel(dadosSenha);
      const textoFala = `Senha ${dadosSenha.senha}, comparecer ao ${novaSenhaFormatada.local}`;

      if (forcarAudio || !isSpeakingRef.current) {
          anunciarSenha(textoFala);
          isSpeakingRef.current = true;
          setTimeout(() => { isSpeakingRef.current = false; }, 3000);
      }

      setSenhaAtual((prevAtual) => {
        if (prevAtual && prevAtual.numero === novaSenhaFormatada.numero) {
           // Se forçado pelo botão da enfermeira, atualiza o timestamp para piscar a tela
           if (forcarAudio) return { ...novaSenhaFormatada, timestamp: Date.now() };
           return prevAtual;
        }

        if (prevAtual) {
          setUltimasSenhas((prevUltimas) => {
            const novaLista = [prevAtual, ...prevUltimas];
            const listaSemRepeticao = novaLista.filter((item, index, self) =>
              index === self.findIndex((t) => t.numero === item.numero)
            );
            return listaSemRepeticao.slice(0, 3);
          });
        }
        return novaSenhaFormatada;
      });
  };

  const fetchDadosIniciais = async () => {
    try {
      const emAtendimento = await getAllSenhas({ status: 'EM_ATENDIMENTO' });
      if (emAtendimento && emAtendimento.length > 0) {
        setSenhaAtual(formatarParaPainel(emAtendimento[0]));
        setUltimasSenhas(emAtendimento.slice(1, 4).map(formatarParaPainel));
      }
    } catch (error) {
      console.error("Erro painel:", error);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3000");
    
    // OUVINTE DO RÁDIO (Recebe os dados corrigidos da Enfermeira)
    const channel = new BroadcastChannel('fila_nami_channel');

    fetchDadosIniciais();

    socket.on('senhaUpdate', (update) => {
      if (update.action === 'update' && update.data.status === 'EM_ATENDIMENTO') {
        processarNovaSenha(update.data, false);
      }
    });

    channel.onmessage = (event) => {
        if (event.data.type === 'CHAMAR_NOVAMENTE') {
            // Processa os dados que vieram "fake" da enfermeira com o nome certo
            processarNovaSenha(event.data.payload, true);
        }
    };

    return () => {
      socket.disconnect();
      channel.close();
    };
  }, []);

  return (
    <section className="painel-container container-fluid bg-light vh-100 d-flex justify-content-center align-items-center">
      <div className="col-lg d-flex flex-column p-5">
        <div className="row mb-4">
          <div className="col d-flex flex-column justify-content-center align-items-center mb-5">
            <h1 className="fw-bold text-secondary-emphasis text-start texto-senha-atual">Senha Atual</h1>
            <div key={senhaAtual?.timestamp || senhaAtual?.id || 'empty'} className="senha-atual-card shadow-lg text-primary w-75 rounded-4 text-center fw-bold mt-3 animate-flash">
              {senhaAtual?.numero || "---"}
            </div>
          </div>
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
        <div className="col d-flex flex-column">
          <h2 className="fw-bold text-secondary-emphasis mt-4">Últimas senhas</h2>
          <div className="row g-3 mt-2">
            {ultimasSenhas.length > 0
              ? ultimasSenhas.map((senha, index) => (<div className="col-4" key={senha.id || index}><CardUltimaSenha numero={senha.numero} /></div>))
              : [1, 2, 3].map((i) => (<div className="col-4" key={i}><CardUltimaSenha numero="---" /></div>))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PainelSenhas;