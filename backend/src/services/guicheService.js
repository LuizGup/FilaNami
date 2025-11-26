const {
  selectAllGuiches,
  selectGuicheById,
  selectGuicheProfileById,
  insertGuiche,
  updateGuiche,
  deleteGuiche,
} = require("../repositories/guicheDao");

const parseId = (rawId) => {
  const id = Number(rawId);

  if (!id || Number.isNaN(id)) {
    const error = new Error("Invalid guichê id");
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  return id;
};


const getAllGuiches = async () => {
  const guiches = await selectAllGuiches();
  return guiches;
};


const getGuicheById = async (rawId) => {
  const id = parseId(rawId);

  const guiche = await selectGuicheById(id);

  if (!guiche) {
    const error = new Error("Guichê não encontrado.");
    error.code = "GUICHE_NOT_FOUND";
    throw error;
  }

  return guiche;
};


const getGuicheProfileById = async (rawId) => {
  const id = parseId(rawId);

  const guiche = await selectGuicheProfileById(id);

  if (!guiche) {
    const error = new Error("Guichê não encontrado.");
    error.code = "GUICHE_NOT_FOUND";
    throw error;
  }

  return guiche;
};


const createGuiche = async (data) => {
  const { numeroGuiche, senha, idSetor } = data || {};

  if (!numeroGuiche || !senha || !idSetor) {
    const error = new Error(
      "All fields (numeroGuiche, senha, idSetor) are required"
    );
    error.code = "VALIDATION_ERROR";
    throw error;
  }

  const newGuiche = await insertGuiche(numeroGuiche, senha, idSetor);
  return newGuiche;
};


const updateGuicheData = async (rawId, dataToUpdate) => {
  const id = parseId(rawId);

  await getGuicheById(id);

  const updatedGuiche = await updateGuiche(id, dataToUpdate);
  return updatedGuiche;
};

const removeGuiche = async (rawId) => {
  const id = parseId(rawId);

  await getGuicheById(id);

  await deleteGuiche(id);
  return true;
};

module.exports = {
  getAllGuiches,
  getGuicheById,
  getGuicheProfileById,
  createGuiche,
  updateGuicheData,
  removeGuiche,
};
