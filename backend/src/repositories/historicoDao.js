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

const selectAllSenhasHistorico = async () => {
  const historicos = await prisma.Historico.findMany({
    orderBy: {
      idHistorico: "asc",
    },

    select: {
      senha: {
        select: {
          dataEmissao: true,
          senha: true,
          dataConclusao: true,
          status: true,
        },
      },
    },
  });

  return historicos;
};

const insertHistorico = async (data) => {
  const newHistorico = await prisma.Historico.create({
    data,
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
  const deleted = await prisma.Historico.delete({
    where: { idHistorico: id },
  });
  return deleted;
};

module.exports = {
  selectAllHistoricos,
  selectHistoricoById,
  selectAllSenhasHistorico, // <--- ADICIONADO
  insertHistorico,
  updateHistorico,
  deleteHistorico,
};