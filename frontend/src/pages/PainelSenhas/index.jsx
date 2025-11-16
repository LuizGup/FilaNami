import "./index.css";

import { useState } from "react"; 

import CardUltimaSenha from "../../components/PainelComponents/CardUltimaSenha";

function PainelSenhas() {

  const [senhaAtual, setSenhaAtual] = useState({
    numero: "A015",
    servico: "Retirar Sangue",
    local: "Guichê 2",
  });

  const [ultimasSenhas, setUltimasSenhas] = useState([
    { id: 1, numero: "Senha1" },
    { id: 2, numero: "Senha2" },
    { id: 3, numero: "Senha3" },
  ]);

  return (
    <section className="painel-container container-fluid bg-light vh-100 d-flex justify-content-center align-items-center">
      <div className="col-lg-6 d-flex flex-column p-5">
        <div className="row mb-4">
          <div className="col d-flex flex-column justify-content-center mb-5">
            <h1 className="fw-bold text-secondary-emphasis text-start">Senha Atual</h1>
            <div className="senha-atual-card shadow-lg text-primary">
              {senhaAtual?.numero || "---"}
            </div>
          </div>

          <div className="col d-flex flex-column justify-content-center align-items-center mt-4">
            <div className="info-card-wrapper">
              <div className="info-card shadow-sm bg-primary text-white">
                {senhaAtual?.servico || "Aguardando..."}
              </div>
              <div className="info-card shadow-sm bg-primary text-white mt-3">
                {senhaAtual?.local || "Aguardando..."}
              </div>
            </div>
          </div>
        </div>

        <hr />

        <h2 className="fw-bold text-secondary-emphasis mt-4">
          Últimas senhas
        </h2>
        <div className="row g-3 mt-2">
          {ultimasSenhas.length > 0
            ? ultimasSenhas.map((senha) => (
                <div className="col-4" key={senha.id}>
                  <CardUltimaSenha numero={senha.numero} />
                </div>
              ))
            : 
              [1, 2, 3].map((i) => (
                <div className="col-4" key={i}>
                  <CardUltimaSenha numero="---" />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

export default PainelSenhas;
