const { selectGuicheById } = require("../repositories/guicheDao");

const loginGuiche = async (idGuiche, senha) => {
    if (!idGuiche || !senha) {
        const error = new Error(
            "Campos obrigatórios: idGuiche e senha."
        );
        error.code = "VALIDATION_ERROR";
        throw error;
    }

    const guiche = await selectGuicheById(idGuiche);

    if (!guiche) {
        const error = new Error("Guichê não encontrado.");
        error.code = "GUICHE_NOT_FOUND";
        throw error;
    }

    if (guiche.senha !== senha) {
        const error = new Error("Senha inválida para este guichê.");
        error.code = "INVALID_CREDENTIALS";
        throw error;
    }

    // Retorna só o necessário para o front
    return {
        idGuiche: guiche.idGuiche,
        numeroGuiche: guiche.numeroGuiche,
        idSetor: guiche.idSetor,
    };
};

module.exports = {
    loginGuiche,
};
