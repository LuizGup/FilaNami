import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import GuicheDisplay from "../../components/GuicheDisplay";
import { loginGuiche } from "../../services/guicheService";

// Pode manter esse mock para exibição na tela
const GUICHES_DISPONIVEIS = [
    { id: 1, number: "Guichê 1", sector: "Atendimento", variant: "primary" },
    { id: 2, number: "Guichê 2", sector: "Atendimento", variant: "primary" },
    { id: 3, number: "Guichê 1", sector: "Exame de Sangue", variant: "primary" },
];

const LoginFuncionario = () => {
    const navigate = useNavigate();
    const [selectedGuicheId, setSelectedGuicheId] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

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

            // Se quiser guardar o guichê logado em localStorage
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

                <div className="row justify-content-center mb-4">
                    {GUICHES_DISPONIVEIS.map((guiche) => (
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
                            disabled={!selectedGuicheId}
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
