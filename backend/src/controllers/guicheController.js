const {
  getAllGuiches,
  getGuicheById,
  getGuicheProfileById,
  createGuiche,
  updateGuicheData,
  removeGuiche,
} = require("../services/guicheService");


const getAllGuichesHandler = async (req, res) => {
  try {
    const guiches = await getAllGuiches();
    return res.status(200).json(guiches);
  } catch (error) {
    console.error("[getAllGuichesHandler] Erro:", error);
    return res.status(500).json({ error: "Failed to retrieve guiches" });
  }
};

const getGuicheByIdHandler = async (req, res) => {
  try {
    const guiche = await getGuicheById(req.params.id);
    return res.status(200).json(guiche);
  } catch (error) {
    console.error("[getGuicheByIdHandler] Erro:", error);

    if (error.code === "VALIDATION_ERROR") {
      return res.status(400).json({ error: error.message });
    }

    if (error.code === "GUICHE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to retrieve guiche" });
  }
};

const getGuicheProfileByIdHandler = async (req, res) => {
  try {
    const guiche = await getGuicheProfileById(req.params.id);
    return res.status(200).json(guiche);
  } catch (error) {
    console.error("[getGuicheProfileByIdHandler] Erro:", error);

    if (error.code === "VALIDATION_ERROR") {
      return res.status(400).json({ error: error.message });
    }

    if (error.code === "GUICHE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to retrieve guiche" });
  }
};

const createGuicheHandler = async (req, res) => {
  try {
    const newGuiche = await createGuiche(req.body);
    return res.status(201).json(newGuiche);
  } catch (error) {
    console.error("[createGuicheHandler] Erro:", error);

    if (error.code === "VALIDATION_ERROR" || error.message?.includes("required")) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to create guiche" });
  }
};

const updateGuicheHandler = async (req, res) => {
  try {
    const updatedGuiche = await updateGuicheData(req.params.id, req.body);
    return res.status(200).json(updatedGuiche);
  } catch (error) {
    console.error("[updateGuicheHandler] Erro:", error);

    if (error.code === "VALIDATION_ERROR") {
      return res.status(400).json({ error: error.message });
    }

    if (error.code === "GUICHE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to update guiche" });
  }
};

const deleteGuicheHandler = async (req, res) => {
  try {
    await removeGuiche(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error("[deleteGuicheHandler] Erro:", error);

    if (error.code === "VALIDATION_ERROR") {
      return res.status(400).json({ error: error.message });
    }

    if (error.code === "GUICHE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to delete guiche" });
  }
};

module.exports = {
  getGuicheProfileByIdHandler,
  getAllGuichesHandler,
  getGuicheByIdHandler,
  createGuicheHandler,
  updateGuicheHandler,
  deleteGuicheHandler,
};
