const {
  selectAllGuiches,
  selectGuicheById,
  insertGuiche,
  updateGuiche,
  deleteGuiche,
} = require("../repositories/guicheDao"); // Ajuste o caminho se o nome for guiche.model.js

const getAllGuiches = async (req, res) => {
  try {
    const guiches = await selectAllGuiches();
    res.status(200).json(guiches);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve guiches" });
  }
};

const getGuiche = async (req, res) => {
  // CORREÇÃO: A sintaxe correta é 'const id = ...'
  const id = parseInt(req.params.id);

  // Boa prática: verificar se o ID é um número válido
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const guiche = await selectGuicheById(id);
    if (!guiche) {
      res.status(404).json({ error: "Guiche not found" });
    } else {
      return res.status(200).json(guiche);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve guiche" });
  }
};

const createGuiche = async (req, res) => {
  // Campos do modelo Guiche
  const { numeroGuiche, senha, idSetor } = req.body;

  // Validação para Guiche
  if (!numeroGuiche || !senha || !idSetor) {
    return res
      .status(400)
      .json({
        error: "All fields (numeroGuiche, senha, idSetor) are required",
      });
  }

  try {
    const newGuiche = await insertGuiche(numeroGuiche, senha, idSetor);
    res.status(201).json(newGuiche);
  } catch (error) {
    res.status(500).json({ error: "Failed to create guiche" });
  }
};

const updateGuiche = async (req, res) => {
  const id = parseInt(req.params.id);
  const dataToUpdate = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const updatedGuiche = await updateGuiche(id, dataToUpdate);
    res.status(200).json(updatedGuiche);
  } catch (error) {
    res.status(500).json({ error: "Failed to update guiche" });
  }
};

const deleteGuiche = async (req, res) => {
  // CORREÇÃO: A sintaxe correta é 'const id = ...'
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    await deleteGuiche(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete guiche" });
  }
};

module.exports = {
  getAllGuiches,
  getGuicheById,
  createGuiche,
  updateGuiche,
  deleteGuiche,
};