const prisma = require("../prisma");

const selectAllHistoricos = async () => {
  const historicos = await prisma.Historico.findMany({
    orderBy: {
      idHistorico: "asc",
    },
    include: {
      guiche: true,
      senha: true,
    },
  });

  return historicos;
};

const selectHistoricoById = async (id) => {
  const historico = await prisma.Historico.findUnique({
    where: { idHistorico: id },
    include: {
      guiche: true,
      senha: true,
    },
  });

  return historico;
};

const insertHistorico = async (idGuiche, idSenha) => {
  const newHistorico = await prisma.Historico.create({
    data: {
      idGuiche,
      idSenha,
    },
  });

  return newHistorico;
};

const updateHistorico = async (id, dataToUpdate) => {
  const updatedHistorico = await prisma.Historico.update({
    where: { idHistorico: id },
    data: {
      ...dataToUpdate,
    },
  });

  return updatedHistorico;
};

const deleteHistorico = async (id) => {
  await prisma.Historico.delete({
    where: { idHistorico: id },
  });
};

module.exports = {
  selectAllHistoricos,
  selectHistoricoById,
  insertHistorico,
  updateHistorico,
  deleteHistorico,
};
