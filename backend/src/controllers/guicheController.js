// src/controllers/guicheController.js
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
    console.error("[getAllGuichesHandler]", error);
    return res.status(500).json({ error: "Failed to retrieve guiches" });
  }
};

const getGuicheByIdHandler = async (req, res) => {
  try {
    const guiche = await getGuicheById(req.params.id);
    return res.status(200).json(guiche);
  } catch (error) {
    console.error("[getGuicheByIdHandler]", error);

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
    console.error("[getGuicheProfileByIdHandler]", error);

    if (error.code === "VALIDATION_ERROR") {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === "GUICHE_NOT_FOUND") {
      return res.status(404).json({ error: error.message });
    }

    return res.status(500).json({ error: "Failed to retrieve guiche profile" });
  }
};

const createGuicheHandler = async (req, res) => {
  try {
    const newGuiche = await createGuiche(req.body);
    return res.status(201).json(newGuiche);
  } catch (error) {
    console.error("[createGuicheHandler]", error);

    if (error.code === "VALIDATION_ERROR") {
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
    console.error("[updateGuicheHandler]", error);

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
    console.error("[deleteGuicheHandler]", error);

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
  getAllGuichesHandler,
  getGuicheByIdHandler,
  getGuicheProfileByIdHandler,
  createGuicheHandler,
  updateGuicheHandler,
  deleteGuicheHandler,
};
