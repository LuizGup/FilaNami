const prisma = require("../prisma"); // Ajuste o caminho se necessário

const findAllGuiches = async () => {
  const guiches = await prisma.Guiche.findMany({
    orderBy: {
      idGuiche: "asc",
    },
  });
  return guiches;
};

const findGuicheById = async (id) => {
  const guiche = await prisma.Guiche.findUnique({
    where: {
      idGuiche: id,
    },
  });
  return guiche;
};

const createGuiche = async (numeroGuiche, senha, idSetor) => {
  const newGuiche = await prisma.Guiche.create({
    data: {
      numeroGuiche,
      senha,
      idSetor,
    },
  });
  return newGuiche;
};

const updateGuiche = async (id, dataToUpdate) => {
  const updatedGuiche = await prisma.Guiche.update({
    where: {
      idGuiche: id,
    },
    data: {
      ...dataToUpdate,
    },
  });
  return updatedGuiche;
};

const deleteGuiche = async (id) => {
  await prisma.Guiche.delete({
    where: {
      idGuiche: id,
    },
  });
};

module.exports = {
  findAllGuiches,
  findGuicheById,
  createGuiche,
  updateGuiche,
  deleteGuiche,
};