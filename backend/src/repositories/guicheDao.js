const prisma = require("../prisma");

const selectAllGuiches = async () => {
  const guiches = await prisma.Guiche.findMany({
    orderBy: {
      idGuiche: "asc",
    },
  });
  return guiches;
};

const selectGuicheById = async (id) => {
  const guiche = await prisma.Guiche.findUnique({
    where: {
      idGuiche: id,
    },
  });
  return guiche;
};

const selectGuicheProfileById = async (id) => {
  const guiche = await prisma.Guiche.findUnique({
    where: {
      idGuiche: id,
    },
    select: {
      idSetor,
      numeroGuiche,
    },
  });
  return guiche;
};

const insertGuiche = async (numeroGuiche, senha, idSetor) => {
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
  selectGuicheProfileById,
  selectAllGuiches,
  selectGuicheById,
  insertGuiche,
  updateGuiche,
  deleteGuiche,
};
