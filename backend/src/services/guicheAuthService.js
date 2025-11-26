// src/services/guicheAuthService.js
const jwt = require("jsonwebtoken");
const { selectGuicheById } = require("../repositories/guicheDao");

const JWT_SECRET = process.env.JWT_SECRET || "dev-guiche-secret";
const JWT_EXPIRES_IN = "8h";

// valida id numérico
const parseId = (rawId) => {
    const id = Number(rawId);

    if (!id || Number.isNaN(id)) {
        const error = new Error("idGuiche inválido.");
        error.code = "VALIDATION_ERROR";
        throw error;
    }

    return id;
};

const loginGuicheService = async (rawIdGuiche, senha) => {
    console.log("🔵 [guicheAuthService] loginGuicheService chamado:", {
        rawIdGuiche,
        senhaRecebida: senha,
    });

    if (!rawIdGuiche || !senha) {
        const error = new Error("Campos obrigatórios: idGuiche e senha.");
        error.code = "VALIDATION_ERROR";
        throw error;
    }

    const idGuiche = parseId(rawIdGuiche);

    const guiche = await selectGuicheById(idGuiche);
    console.log("🔵 [guicheAuthService] Guichê encontrado:", guiche);

    if (!guiche) {
        const error = new Error("Guichê não encontrado.");
        error.code = "GUICHE_NOT_FOUND";
        throw error;
    }

    // aqui estamos comparando senha em texto puro (sem bcrypt)
    if (guiche.senha !== senha) {
        const error = new Error("Senha inválida para este guichê.");
        error.code = "INVALID_CREDENTIALS";
        throw error;
    }

    const payload = {
        idGuiche: guiche.idGuiche,
        idSetor: guiche.idSetor,
        numeroGuiche: guiche.numeroGuiche,
    };

    console.log("🟢 [guicheAuthService] Gerando token com payload:", payload);

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    return {
        token,
        guiche: {
            idGuiche: guiche.idGuiche,
            numeroGuiche: guiche.numeroGuiche,
            idSetor: guiche.idSetor,
        },
    };
};

module.exports = {
    loginGuicheService,
};
