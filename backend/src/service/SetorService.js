const prisma = require("../prisma");

/** Lista todos os setores em ordem crescente pelo ID */
const getAllSetoresModel = async () => {
  const setores = await prisma.setor.findMany({
    orderBy: { idSetor: "asc" },
  });
  return setores;
};

/** Busca um setor pelo ID */
const getSetorByIdModel = async (idSetor) => {
  const setor = await prisma.setor.findUnique({
    where: { idSetor: Number(idSetor) },
  });
  return setor;
};

/** Cria um novo setor */
const createSetorModel = async (setor) => {
  const novoSetor = await prisma.setor.create({
    data: { setor },
  });
  return novoSetor;
};

/** Atualiza parcialmente um setor */
const updateSetorModel = async (idSetor, dataToUpdate) => {
  const atualizado = await prisma.setor.update({
    where: { idSetor: Number(idSetor) },
    data: { ...dataToUpdate },
  });
  return atualizado;
};

/** Deleta um setor pelo ID */
const deleteSetorModel = async (idSetor) => {
  await prisma.setor.delete({
    where: { idSetor: Number(idSetor) },
  });
};

/** (Opcional) Busca um setor com seus guichês relacionados */
const getSetorWithGuichesModel = async (idSetor) => {
  const setor = await prisma.setor.findUnique({
    where: { idSetor: Number(idSetor) },
    include: { guiches: true },
  });
  return setor;
};

module.exports = {
  getAllSetoresModel,
  getSetorByIdModel,
  createSetorModel,
  updateSetorModel,
  deleteSetorModel,
  getSetorWithGuichesModel,
};
