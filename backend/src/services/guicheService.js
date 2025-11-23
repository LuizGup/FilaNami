const {
  selectAllGuiches,
  selectGuicheById,
  insertGuiche,
  updateGuiche,
  deleteGuiche,
} = require("../repositories/guicheDao");

const getAllGuiches = async () => {
  return await selectAllGuiches();
};

const getGuicheById = async (id) => {
  const guiche = await selectGuicheById(id);
  if (!guiche) {
    throw new Error("Guiche not found");
  }
  return guiche;
};

const createGuiche = async (data) => {
  const { numeroGuiche, senha, idSetor } = data;

  if (!numeroGuiche || !senha || !idSetor) {
    throw new Error("All fields (numeroGuiche, senha, idSetor) are required");
  }

  return await insertGuiche(numeroGuiche, senha, idSetor);
};

const updateGuicheData = async (id, data) => {
  return await updateGuiche(id, data);
};

const removeGuiche = async (id) => {
  return await deleteGuiche(id);
};

module.exports = {
  getAllGuiches,
  getGuicheById,
  createGuiche,
  updateGuicheData,
  removeGuiche,
};