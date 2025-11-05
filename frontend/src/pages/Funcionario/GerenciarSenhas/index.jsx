import "./index.css"
import { mockSenhas } from "../../../data/mockSenhas";
import NavbarFuncionario from "../../../components/FuncionarioComponents/NavbarFuncionario";
import CardSenha from "../../../components/FuncionarioComponents/CardSenha";
function GerenciarSenhas() {
  const senhasEsperando = mockSenhas.filter(
    (s) => s.status === "Esperando"
  );
  const senhasFeito = mockSenhas.filter((s) => s.status === "Feito");

  return (
    <>
      <section className="gerenciar-senhas-container">
        <NavbarFuncionario />

        {/* Usa container-fluid para ocupar mais espaço, como no mockup */}
        <div className="container-fluid mt-4" style={{paddingLeft: '2rem', paddingRight: '2rem'}}>
          <div className="d-flex justify-content-between align-items: center mb-3">
            <h2>Status Senha</h2>
            <span className="last-updated">Last updated: Just now</span>
          </div>

          {/* Container das Colunas Kanban */}
          <div className="row g-4">
            
            {/* Coluna Esperando */}
            <div className="col-md-6">
              <div className="senha-coluna">
                <div className="coluna-header esperando">
                  <span>🏆 Esperando</span>
                  <span className="coluna-count">{senhasEsperando.length}</span>
                </div>
                <div className="coluna-body">
                  {senhasEsperando.map((senha) => (
                    <CardSenha
                      key={senha.id}
                      numero={senha.numero}
                      status={senha.status}
                      tempo={senha.tempo}
                      guicheLabel={senha.guicheLabel}
                      guicheValor={senha.guicheValor}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna Feito */}
            <div className="col-md-6">
              <div className="senha-coluna">
                <div className="coluna-header feito">
                  <span>✅ Feito</span>
                  <span className="coluna-count">{senhasFeito.length}</span>
                </div>
                <div className="coluna-body">
                  {senhasFeito.map((senha) => (
                    <CardSenha
                      key={senha.id}
                      numero={senha.numero}
                      status={senha.status}
                      tempo={senha.tempo}
                      guicheLabel={senha.guicheLabel}
                      guicheValor={senha.guicheValor}
                    />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Botões de Ação */}
        <div className="botoes-acao-container">
          <button className="btn btn-acao-primary">Chamar Próximo</button>
          <button className="btn btn-acao-primary">Chamar Novamente</button>
        </div>
      </section>
    </>
  );
}

export default GerenciarSenhas;