import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import GuicheDisplay from "../../components/GuicheDisplay";
import { loginGuiche } from "../../services/guicheAuthService";

// 🚨 SOMENTE ESTES 3 GUICHÊS FICAM NA TELA
const GUICHES_DISPONIVEIS = [
    { id: 1, number: "Guichê 1", sector: "Atendimento", variant: "primary" },
    { id: 2, number: "Guichê 2", sector: "Atendimento", variant: "primary" },
    { id: 4, number: "Guichê 1", sector: "Exame de Sangue", variant: "primary" }
];

const LoginFuncionario = () => {
    const navigate = useNavigate();
    const [selectedGuicheId, setSelectedGuicheId] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleGuicheSelection = (id) => {
        console.log("Selecionado:", id);
        setSelectedGuicheId(id);
    };

    const onSubmit = async (data) => {
        if (!selectedGuicheId) {
            alert("Selecione um guichê antes de prosseguir!");
            return;
        }

        try {
            const result = await loginGuiche(selectedGuicheId, data.password);
            console.log("LOGIN OK:", result);

            alert("Login realizado com sucesso!");
            navigate("/Home-Funcionario-Senhas");
        } catch (error) {
            console.error("Erro no login:", error);
            alert(error?.response?.data?.error || "Erro ao fazer login.");
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
                    <p className="lead text-secondary">Login do Funcionário</p>
                </div>

                <div className="row justify-content-center mb-4">
                    {GUICHES_DISPONIVEIS.map((g) => (
                        <GuicheDisplay
                            key={g.id}
                            number={g.number}
                            sector={g.sector}
                            variant={g.variant}
                            isSelected={selectedGuicheId === g.id}
                            onClick={() => handleGuicheSelection(g.id)}
                        />
                    ))}
                </div>

                {/* FORM DE LOGIN */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Senha do guichê"
                            {...register("password", { required: "Senha obrigatória" })}
                        />
                        {errors.password && (
                            <small className="text-danger">{errors.password.message}</small>
                        )}
                    </div>

                    <button
                        className="btn btn-primary btn-lg w-100"
                        type="submit"
                        disabled={!selectedGuicheId}
                    >
                        Entrar
                    </button>
                </form>

                <p className="mt-4 text-center text-muted small">
                    © 2025 NAMI. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
};

export default LoginFuncionario;
