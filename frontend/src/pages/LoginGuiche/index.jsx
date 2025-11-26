import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import GuicheDisplay from "../../components/GuicheDisplay";
import { loginGuiche, getAllGuiches } from "../../services/guicheService";

const LoginFuncionario = () => {
    const navigate = useNavigate();

    const [selectedGuicheId, setSelectedGuicheId] = useState(null);
    const [guiches, setGuiches] = useState([]);
    const [isLoadingGuiches, setIsLoadingGuiches] = useState(true);
    const [guicheError, setGuicheError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // 🔄 Buscar guichês reais do backend
    useEffect(() => {
        const fetchGuiches = async () => {
            console.log("🔄 Buscando guichês do backend...");
            try {
                const data = await getAllGuiches();
                console.log("✅ Guichês recebidos do backend (bruto):", data);

                // Mapeia pro formato usado no componente visual
                const mapeados = data.map((g) => ({
                    id: g.idGuiche,
                    number: `Guichê ${g.numeroGuiche}`,
                    sector: g.setor?.setor || `Setor ${g.idSetor}`,
                    variant: "primary",
                }));

                console.log("📦 Guichês mapeados para UI:", mapeados);
                setGuiches(mapeados);
                setGuicheError(null);
            } catch (err) {
                console.error("❌ Erro ao carregar guichês:", err);
                setGuicheError("Erro ao carregar guichês. Tente novamente mais tarde.");
            } finally {
                setIsLoadingGuiches(false);
            }
        };

        fetchGuiches();
    }, []);

    const handleGuicheSelection = (guicheId) => {
        console.log("🔵 Selecionando guichê:", guicheId);
        setSelectedGuicheId(guicheId);
    };

    const onSubmit = async (data) => {
        console.log("🔵 Iniciando login...");
        console.log("➡ Senha digitada:", data.password);
        console.log("➡ Guichê selecionado:", selectedGuicheId);

        if (!selectedGuicheId) {
            console.warn("⚠ Nenhum guichê selecionado.");
            alert("Por favor, selecione um Guichê disponível para continuar.");
            return;
        }

        const payload = {
            idGuiche: selectedGuicheId,
            senha: data.password,
        };

        console.log("📤 Payload enviado ao backend:", payload);

        try {
            const result = await loginGuiche(payload);

            console.log("📥 Resposta do backend:", result);

            localStorage.setItem("guicheLogado", JSON.stringify(result));

            alert("Login no guichê realizado com sucesso!");
            navigate("/HomeFuncionarioSenhas");
        } catch (error) {
            console.error("❌ ERRO NO LOGIN DO GUICHÊ:", error);

            const message =
                error?.error || error?.message || "Erro ao fazer login no guichê.";

            console.log("❗ Mensagem exibida ao usuário:", message);
            alert(message);
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
                        Login
                    </p>
                    <p className="text-muted small mt-0">NAMI LOGIN</p>
                </div>

                {/* LISTA DE GUICHÊS */}
                <div className="row justify-content-center mb-4">
                    {isLoadingGuiches && (
                        <p className="text-muted text-center">Carregando guichês...</p>
                    )}

                    {!isLoadingGuiches && guicheError && (
                        <p className="text-danger text-center">{guicheError}</p>
                    )}

                    {!isLoadingGuiches && !guicheError && guiches.length === 0 && (
                        <p className="text-muted text-center">
                            Nenhum guichê disponível no momento.
                        </p>
                    )}

                    {/* 👇 Só mostra os 3 primeiros guichês */}
                    {!isLoadingGuiches &&
                        !guicheError &&
                        guiches.slice(0, 3).map((guiche) => (
                            <GuicheDisplay
                                key={guiche.id}
                                number={guiche.number}
                                sector={guiche.sector}
                                variant={guiche.variant}
                                onClick={() => handleGuicheSelection(guiche.id)}
                                isSelected={guiche.id === selectedGuicheId}
                            />
                        ))}
                </div>

                {/* FORM LOGIN */}
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
                            disabled={!selectedGuicheId || isLoadingGuiches || !!guicheError}
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
