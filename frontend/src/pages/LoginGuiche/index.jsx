import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import GuicheDisplay from "../../components/GuicheDisplay";
import { getAllGuiches } from "../../services/guicheService";

import { AuthContext } from "../../contexts/AuthContext";

const LoginFuncionario = () => {
    const navigate = useNavigate();
    
    const { loginGuiche } = useContext(AuthContext);

    const [guiches, setGuiches] = useState([]);
    const [selectedGuicheId, setSelectedGuicheId] = useState(null);
    const [tipoGuiche, setTipoGuiche] = useState("");
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
                const data = await getAllGuiches();
                setGuiches(data);
            } catch (error) {
                console.error("❌ [LoginGuiche] Erro ao carregar guichês:", error);
                setErrorGuiches("Erro ao carregar guichês. Tente novamente mais tarde.");
            } finally {
                setLoadingGuiches(false);
            }
        };

        fetchGuiches();
    }, []);

    const handleGuicheSelection = (guicheId, tipo) => {
        setSelectedGuicheId(guicheId);
        setTipoGuiche(tipo);
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

            if(token && guiche) {
                if (tipoGuiche === "Atendimento") {
                    navigate("/user");
                    return;
                }
    
                if (tipoGuiche === "Exame de Sangue") {
                    navigate("/enfermeira");
                    return;
                }
            }
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
                                onClick={() => handleGuicheSelection(guiche.idGuiche, guiche.setor?.setor || "")}
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

export default LoginFuncionario;