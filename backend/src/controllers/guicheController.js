const {
  getAllGuichesModel,
  getGuicheByIdModel,
  createGuicheModel,
  updateGuicheModel,
  deleteGuicheModel,
} = require("../models/guicheModel"); // Ajuste o caminho se o nome for guiche.model.js

const getAllGuichesHandler = async (req, res) => {
  try {
    const guiches = await getAllGuichesModel();
    res.status(200).json(guiches);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve guiches" });
  }
};

const getGuicheByIdHandler = async (req, res) => {
  // CORREÇÃO: A sintaxe correta é 'const id = ...'
  const id = parseInt(req.params.id);

  // Boa prática: verificar se o ID é um número válido
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const guiche = await getGuicheByIdModel(id);
    if (!guiche) {
      res.status(404).json({ error: "Guiche not found" });
    } else {
      return res.status(200).json(guiche);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve guiche" });
  }
};

const createGuicheHandler = async (req, res) => {
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
    const newGuiche = await createGuicheModel(numeroGuiche, senha, idSetor);
    res.status(201).json(newGuiche);
  } catch (error) {
    res.status(500).json({ error: "Failed to create guiche" });
  }
};

const updateGuicheHandler = async (req, res) => {
  // CORREÇÃO: A sintaxe correta é 'const id = ...'
  const id = parseInt(req.params.id);
  const dataToUpdate = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const updatedGuiche = await updateGuicheModel(id, dataToUpdate);
    res.status(200).json(updatedGuiche);
  } catch (error) {
    res.status(500).json({ error: "Failed to update guiche" });
  }
};

const deleteGuicheHandler = async (req, res) => {
  // CORREÇÃO: A sintaxe correta é 'const id = ...'
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    await deleteGuicheModel(id);
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