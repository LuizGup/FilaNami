
const {
  selectAllSetores,
  selectSetorById,
  insertSetor,
  updateSetor: updateSetorDao,
  deleteSetor: deleteSetorDao,
} = require("../repositories/setorDao");

const findAllSetores = async () => {
  return await selectAllSetores();
};

const findSetorById = async (id) => {
  const setor = await selectSetorById(Number(id));
  return setor;
};

const createSetor = async (setorNome) => {
  if (!setorNome || typeof setorNome !== 'string' || setorNome.trim() === '') {
    throw new Error('CAMPOS_OBRIGATORIOS: campo "setor" é obrigatório.');
  }
  return await insertSetor(setorNome.trim());
};

const updateSetor = async (id, dataToUpdate) => {
  const existing = await selectSetorById(Number(id));
  if (!existing) return null;
  return await updateSetorDao(Number(id), dataToUpdate);
};

const deleteSetor = async (id) => {
  const existing = await selectSetorById(Number(id));
  if (!existing) return false;
  await deleteSetorDao(Number(id));
  return true;
};

module.exports = {
  findAllSetores,
  findSetorById,
  createSetor,
  updateSetor,
  deleteSetor,
};


