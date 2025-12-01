import "./index.css";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { getAllSenhas } from "../../services/senhaService"; 

// --- LISTA DE BLOQUEIO ---
// IDs reais do banco da enfermeira. O Painel vai IGNORAR o socket deles.
const IDS_IGNORAR_DO_SOCKET = [4, 5, 6, 7]; 

function PainelSenhas() {
  const [senhaAtual, setSenhaAtual] = useState(null);
  const [ultimasSenhas, setUltimasSenhas] = useState([]);
  
  const isSpeakingRef = useRef(false);

  const formatarParaPainel = (dadosBackend) => {
    return {
      id: dadosBackend.idSenha,
      numero: dadosBackend.senha,
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
    const channel = new BroadcastChannel('fila_nami_channel');

    fetchDadosIniciais();

    // 1. OUVINTE DO BACKEND
    socket.on('senhaUpdate', (update) => {
      if (update.action === 'update' && update.data.status === 'EM_ATENDIMENTO') {
        
        const idChegou = Number(update.data.idGuiche || update.data.idGuicheAtendente);
        
        // --- TRAVA DE SEGURANÇA ---
        // Se for ID da enfermeira, PARE AQUI. Não toque som, não mostre nada.
        if (IDS_IGNORAR_DO_SOCKET.includes(idChegou)) {
            return; 
        }

        processarNovaSenha(update.data, false);
      }
    });

    // 2. OUVINTE DA GAMBIARRA (RÁDIO)
    channel.onmessage = (event) => {
        if (event.data.type === 'CHAMAR_NOVAMENTE') {
            // Aqui chega o dado corrigido ("Guichê 1", "Coleta")
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
              ? ultimasSenhas.map((senha, index) => (
                  <div className="col-4" key={senha.id || index}>
                    {/* CARD SIMPLES SUBSTITUINDO O COMPONENTE QUE NÃO EXISTE */}
                    <div className="card shadow-sm border-0 text-center py-3">
                        <h2 className="fw-bold text-secondary mb-0">{senha.numero}</h2>
                    </div>
                  </div>
                ))
              : [1, 2, 3].map((i) => (
                  <div className="col-4" key={i}>
                     <div className="card shadow-sm border-0 text-center py-3">
                        <h2 className="fw-bold text-muted mb-0">---</h2>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PainelSenhas;