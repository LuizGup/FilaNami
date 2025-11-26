const prisma = require("../prisma");

const selectAllGuiches = async () => {
  // já traz o setor junto pra exibir no front
  const guiches = await prisma.Guiche.findMany({
    orderBy: {
      idGuiche: "asc",
    },
    include: {
      setor: true,
    },
  });
  return guiches;
};

const selectGuicheById = async (id) => {
  const guiche = await prisma.Guiche.findUnique({
    where: {
      idGuiche: id,
    },
    include: {
      setor: true,
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
      idSetor: true,
      numeroGuiche: true,
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
