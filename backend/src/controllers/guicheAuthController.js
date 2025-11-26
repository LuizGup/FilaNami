// src/controllers/guicheAuthController.js
const { loginGuicheService } = require("../services/guicheAuthService");

const loginGuicheHandler = async (req, res) => {
    try {
        const { idGuiche, senha } = req.body;

        console.log("🔵 [guicheAuthController] Body recebido:", {
            idGuiche,
            senhaRecebida: senha,
        });

        const result = await loginGuicheService(idGuiche, senha);

        console.log("🟢 [guicheAuthController] Login OK, retornando resposta.");
        return res.status(200).json(result);
    } catch (error) {
        console.error("❌ [guicheAuthController] Erro no login:", error);

        if (error.code === "VALIDATION_ERROR") {
            return res.status(400).json({ error: error.message });
        }

        if (error.code === "GUICHE_NOT_FOUND" || error.code === "INVALID_CREDENTIALS") {
            return res.status(401).json({ error: error.message });
        }

        return res
            .status(500)
            .json({ error: "Erro interno ao autenticar o guichê." });
    }
};

module.exports = {
    loginGuicheHandler,
};
