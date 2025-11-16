import { useState } from 'react'; // 👈 Não precisa mais do useEffect

// 1. O service NÃO é importado (sem API)

// 2. Importa o componente filho
import CardUltimaSenha from "../../components/PainelComponents/CardUltimaSenha";

// 3. Importa o CSS da página
import "./index.css";

function PainelSenhas() {
  
  // --- DADOS ESTÁTICOS (MOCK) ---
  // Pré-populamos os estados com dados de exemplo
  // para que você possa focar apenas no CSS.

  const [senhaAtual, setSenhaAtual] = useState({
    numero: "A015",
    servico: "Retirar Sangue",
    local: "Guichê 2"
  });

  const [ultimasSenhas, setUltimasSenhas] = useState([
    { id: 1, numero: "Senha1" }, // Dados baseados na sua imagem
    { id: 2, numero: "Senha2" },
    { id: 3, numero: "Senha3" }
  ]);

  // --- LÓGICA DE API E SOCKET REMOVIDA ---
  // A função fetchDadosPainel() foi removida.
  // O hook useEffect() foi removido.
  

  // --- Renderização do JSX (Permanece igual) ---

  return (
    <section className="painel-container container-fluid">
      <div className="row vh-100">

        {/* Coluna Esquerda: Senha Atual */}
        <div className="col-lg-6 d-flex flex-column justify-content-center align-items-center p-4">
          <h1 className="painel-title text-secondary">Senha Atual</h1>
          <div className="senha-atual-card shadow-lg text-primary">
            {/* Agora isso vai mostrar "A015" direto */}
            {senhaAtual?.numero || "---"}
          </div>
        </div>

        {/* Coluna Direita: Infos e Últimas Senhas */}
        <div className="col-lg-6 bg-light d-flex flex-column justify-content-center p-5">
          
          {/* Infos da Senha Atual */}
          <div className="info-card-wrapper mb-4">
            <div className="info-card shadow-sm bg-primary text-white">
              {/* Mostra "Retirar Sangue" */}
              {senhaAtual?.servico || "Aguardando..."}
            </div>
            <div className="info-card shadow-sm bg-primary text-white mt-3">
              {/* Mostra "Guichê 2" */}
              {senhaAtual?.local || "Aguardando..."}
            </div>
          </div>

          <hr />

          {/* Últimas Senhas */}
          <h2 className="ultimas-senhas-title text-secondary mt-4">
            Últimas senhas
          </h2>
          <div className="row g-3 mt-2">
            
            {/* Como 'ultimasSenhas' agora tem 3 itens,
              o '.map' será executado e o 'else' (com "---") será ignorado.
            */}
            {ultimasSenhas.length > 0 ? (
              ultimasSenhas.map((senha) => (
                <div className="col-4" key={senha.id}>
                  <CardUltimaSenha 
                    numero={senha.numero}
                  />
                </div>
              ))
            ) : (
              // Este trecho não será mais exibido
              [1, 2, 3].map(i => (
                <div className="col-4" key={i}>
                  <CardUltimaSenha numero="---" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PainelSenhas;