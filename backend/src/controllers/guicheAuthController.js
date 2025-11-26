const { loginGuiche } = require("../services/guicheAuthService");

const loginGuicheHandler = async (req, res) => {
    const { idGuiche, senha } = req.body;

    try {
        const guicheData = await loginGuiche(idGuiche, senha);
        return res.status(200).json(guicheData);
    } catch (error) {
        console.error("Erro ao autenticar guichê:", error.message);

        if (error.code === "VALIDATION_ERROR") {
            return res.status(400).json({ error: error.message });
        }

        if (error.code === "GUICHE_NOT_FOUND") {
            return res.status(404).json({ error: error.message });
        }

        if (error.code === "INVALID_CREDENTIALS") {
            return res.status(401).json({ error: error.message });
        }

        return res.status(500).json({ error: "Erro ao autenticar guichê." });
    }
};

module.exports = {
    loginGuicheHandler,
};
