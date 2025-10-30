import CardSenha from "../../../components/FuncionarioComponents/CardSenha";
import NavbarFuncionario from "../../../components/FuncionarioComponents/NavbarFuncionario";
import "./index.css";

function GerenciarSenhas() {
return (
    <>
        <section className="gerenciar-senhas-container d-flex flex-column align-items-center justify-content-center">
        <NavbarFuncionario />
            <h2>Status Senha</h2>

            <div className="container text-center">
                <div className="row row-cols-3">
                    <div
                        className="col"
                        style={{ border: "2px dashed #e74c3c", padding: "12px", marginBottom: "8px" }}
                    >
                        <div className="row mb-3" style={{ border: "1px dotted #3498db", padding: "6px" }}>
                            teste
                        </div>
                        <div className="row mb-3" style={{ border: "1px dotted #3498db", padding: "6px" }}>
                            teste 2
                        </div>
                        <div className="row mb-3" style={{ border: "1px dotted #3498db", padding: "6px" }}>
                            teste 3
                        </div>
                    </div>

                    <div
                        className="col"
                        style={{ border: "2px dashed #27ae60", padding: "12px", marginBottom: "8px" }}
                    >
                        <div className="row mb-3" style={{ border: "1px dotted #8e44ad", padding: "6px" }}>
                            teste A
                        </div>
                        <div className="row mb-3" style={{ border: "1px dotted #8e44ad", padding: "6px" }}>
                            teste B
                        </div>
                        <div className="row mb-3" style={{ border: "1px dotted #8e44ad", padding: "6px" }}>
                            teste C
                        </div>
                    </div>

                    <div
                        className="col"
                        style={{ border: "2px dashed #f39c12", padding: "12px", marginBottom: "8px" }}
                    >
                        <div className="row mb-3" style={{ border: "1px dotted #2c3e50", padding: "6px" }}>
                            teste X
                        </div>
                        <div className="row mb-3" style={{ border: "1px dotted #2c3e50", padding: "6px" }}>
                            teste Y
                        </div>
                        <div className="row mb-3" style={{ border: "1px dotted #2c3e50", padding: "6px" }}>
                            teste Z
                        </div>
                    </div>
                </div>
            </div>

            <CardSenha />
            <div className="d-flex flex-row align-items-center justify-content-center gap-4 mt-4">
                <button className="btn btn-primary">Chamar Próxima Senha</button>
                <button className="btn btn-secondary">Repetir Senha</button>
            </div>
        </section>
    </>
);
}

export default GerenciarSenhas;
