const { getAllGuiches, getGuicheById, createGuiche, updateGuicheData, removeGuiche } = require("../services/guicheService");

const getAllGuichesHandler = async (req, res) => {
  try {
    const guiches = await getAllGuiches();
    res.status(200).json(guiches);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve guiches" });
  }
};

const getGuicheByIdHandler = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const guiche = await getGuicheById(id);
    return res.status(200).json(guiche);
  } catch (error) {
    if (error.message === "Guiche not found") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to retrieve guiche" });
  }
};

const createGuicheHandler = async (req, res) => {
  try {
    const newGuiche = await createGuiche(req.body);
    res.status(201).json(newGuiche);
  } catch (error) {
    if (error.message.includes("required")) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create guiche" });
  }
};

const updateGuicheHandler = async (req, res) => {
  const id = parseInt(req.params.id);
  const dataToUpdate = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const updatedGuiche = await updateGuicheData(id, dataToUpdate);
    res.status(200).json(updatedGuiche);
  } catch (error) {
    res.status(500).json({ error: "Failed to update guiche" });
  }
};

const deleteGuicheHandler = async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    await removeGuiche(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete guiche" });
  }
};

module.exports = {
  getAllGuichesHandler,
  getGuicheByIdHandler,
  createGuicheHandler,
  updateGuicheHandler,
  deleteGuicheHandler,
};