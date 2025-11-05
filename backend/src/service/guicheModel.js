const prisma = require("../prisma"); // Ajuste o caminho se necessário

const getAllGuichesModel = async () => {
  const guiches = await prisma.Guiche.findMany({
    orderBy: {
      idGuiche: "asc",
    },
  });
  return guiches;
};

const getGuicheByIdModel = async (id) => {
  const guiche = await prisma.Guiche.findUnique({
    where: {
      idGuiche: id,
    },
  });
  return guiche;
};

const createGuicheModel = async (numeroGuiche, senha, idSetor) => {
  const newGuiche = await prisma.Guiche.create({
    data: {
      numeroGuiche,
      senha,
      idSetor,
    },
  });
  return newGuiche;
};

const updateGuicheModel = async (id, dataToUpdate) => {
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

const deleteGuicheModel = async (id) => {
  await prisma.Guiche.delete({
    where: {
      idGuiche: id,
    },
  });
};

module.exports = {
  getAllGuichesModel,
  getGuicheByIdModel,
  createGuicheModel,
  updateGuicheModel,
  deleteGuicheModel,
};


// json exemplo de criar guiche:
// {
//   "numeroGuiche": 1,
//   "senha": "senha123",
//   "idSetor": 2
// }