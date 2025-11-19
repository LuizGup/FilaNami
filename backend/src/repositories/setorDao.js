const prisma = require("../prisma");

const findAllSetores = async () => {
  const setores = await prisma.setor.findMany({
    orderBy: { idSetor: "asc" },
  });
  return setores;
};

const findSetorById = async (idSetor) => {
  const setor = await prisma.setor.findUnique({
    where: { idSetor: Number(idSetor) },
  });
  return setor;
};

const createSetor = async (setor) => {
  const novoSetor = await prisma.setor.create({
    data: { setor },
  });
  return novoSetor;
};

const updateSetor = async (idSetor, dataToUpdate) => {
  const atualizado = await prisma.setor.update({
    where: { idSetor: Number(idSetor) },
    data: { ...dataToUpdate },
  });
  return atualizado;
};

const deleteSetor = async (idSetor) => {
  await prisma.setor.delete({
    where: { idSetor: Number(idSetor) },
  });
};

const findSetorWithGuiches = async (idSetor) => {
  const setor = await prisma.setor.findUnique({
    where: { idSetor: Number(idSetor) },
    include: { guiches: true },
  });
  return setor;
};

module.exports = {
  findAllSetores,
  findSetorById,
  createSetor,
  updateSetor,
  deleteSetor,
  findSetorWithGuiches,
};
