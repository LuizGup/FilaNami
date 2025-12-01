import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import GuicheDisplay from "../../components/GuicheDisplay";
import { getAllGuiches } from "../../services/guicheService";

import { AuthContext } from "../../contexts/AuthContext";

const LoginGuiche = () => {
    const navigate = useNavigate();
    
    const { loginGuiche } = useContext(AuthContext);

    const [guiches, setGuiches] = useState([]);
    const [selectedGuicheId, setSelectedGuicheId] = useState(null);
    const [tipoGuiche, setTipoGuiche] = useState(null);
    const [loadingGuiches, setLoadingGuiches] = useState(true);
    const [errorGuiches, setErrorGuiches] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        const fetchGuiches = async () => {
            try {
                console.log("🔄 [LoginGuiche] Buscando guichês do backend...");
                const data = await getAllGuiches();
                
                // --- INÍCIO DA GAMBIARRA DE FILTRO ---
                // Pegamos todos os dados, mas filtramos manualmente apenas UM de cada tipo
                
                // 1. Acha o primeiro guichê de Atendimento
                const atendimento = data.find(g => g.setor?.setor === "Atendimento");
                
                // 2. Acha o primeiro guichê de Exame (aceitando ambos os nomes pra garantir)
                const enfermeira = data.find(g => g.setor?.setor === "Exame de Sangue" || g.setor?.setor === "Coleta de Sangue");

                // 3. Monta a nova lista só com esses dois
                const listaFiltrada = [];
                if (atendimento) listaFiltrada.push(atendimento);
                if (enfermeira) listaFiltrada.push(enfermeira);

                setGuiches(listaFiltrada);
                // --- FIM DA GAMBIARRA ---

            } catch (error) {
                console.error("❌ [LoginGuiche] Erro ao carregar guichês:", error);
                setErrorGuiches("Erro ao carregar guichês. Tente novamente mais tarde.");
            } finally {
                setLoadingGuiches(false);
            }
        };

        fetchGuiches();
    }, []);

    const handleGuicheSelection = (guicheId, setorObjeto) => {
        setSelectedGuicheId(guicheId);
        setTipoGuiche(setorObjeto);
        console.log("➡️ [LoginGuiche] Guichê selecionado:", guicheId, setorObjeto);
    };

    const onSubmit = async (data) => {
        if (!selectedGuicheId) {
            alert("Por favor, selecione um Guichê disponível para continuar.");
            return;
        }

        try {
            const { token, guiche } = await loginGuiche(
                selectedGuicheId,
                data.password
            );

            console.log("🟢 [LoginGuiche] Login OK no Contexto:", { token, guiche });

            const nomeSetor = tipoGuiche?.setor; 
            
            console.log("➡️ [LoginGuiche] Redirecionando. Setor:", nomeSetor);

            if (nomeSetor === "Atendimento") {
                navigate(`/user/gerenciar/${selectedGuicheId}`);
                return;
            }

            // Ajustei aqui para aceitar tanto "Exame de Sangue" quanto "Coleta de Sangue"
            // para garantir que a gambiarra funcione independente de como o banco retornou
            if (nomeSetor === "Exame de Sangue" || nomeSetor === "Coleta de Sangue") {
                navigate(`/enfermeira/gerenciar/${selectedGuicheId}`);
                return;
            }

            navigate(`/user/gerenciar/${selectedGuicheId}`);

        } catch (error) {
            console.error("❌ [LoginGuiche] Erro no login do guichê:", error);

            const msg =
                error?.response?.data?.error ||
                error?.message ||
                "Erro ao fazer login no guichê. Verifique a senha.";

            alert(msg);
        }
    };

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center p-4">
            <div
                className="card p-4 p-md-5 rounded-4 shadow"
                style={{ maxWidth: "600px", width: "90%", backgroundColor: "white" }}
            >
                <div className="text-center mb-4">
                    <h1 className="display-6 fw-bold text-dark">Fila Nami</h1>
                    <p className="lead text-secondary text-uppercase fw-semibold mb-0">
                        Login de Guichê
                    </p>
                    <p className="text-muted small mt-0">NAMI LOGIN</p>
                </div>

                {errorGuiches && (
                    <div className="alert alert-danger" role="alert">
                        {errorGuiches}
                    </div>
                )}

                <div className="row justify-content-center mb-4">
                    {loadingGuiches ? (
                        <p className="text-center text-muted">Carregando guichês...</p>
                    ) : guiches.length === 0 ? (
                        <p className="text-center text-muted">
                            Nenhum guichê disponível para login.
                        </p>
                    ) : (
                        guiches.map((guiche) => (
                            <GuicheDisplay
                                key={guiche.idGuiche}
                                number={`Guichê ${guiche.numeroGuiche}`}
                                sector={guiche.setor?.setor || "Setor"}
                                variant="primary"
                                onClick={() => handleGuicheSelection(guiche.idGuiche, guiche.setor)}
                                isSelected={guiche.idGuiche === selectedGuicheId}
                            />
                        ))
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Senha do guichê"
                            {...register("password", {
                                required: "Senha é obrigatória",
                            })}
                        />
                        {errors.password && (
                            <small className="text-danger">{errors.password.message}</small>
                        )}
                    </div>

                    <div className="d-grid">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={!selectedGuicheId || loadingGuiches}
                        >
                            Login
                        </button>
                    </div>
                </form>

                <p className="mt-5 text-center text-muted small">
                    © 2025 NAMI. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default LoginGuiche;