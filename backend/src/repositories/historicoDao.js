const prisma = require("../prisma"); // ajuste o caminho se necessário

// GET ALL
const getAllHistoricosDao = async () => {
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

// GET BY ID
const getHistoricoByIdDao = async (id) => {
  const historico = await prisma.Historico.findUnique({
    where: { idHistorico: id },
    include: {
      guiche: true,
      senha: true,
    },
  });

  return historico;
};

// CREATE
const createHistoricoDao = async (idGuiche, idSenha) => {
  const newHistorico = await prisma.Historico.create({
    data: {
      idGuiche,
      idSenha,
    },
  });

  return newHistorico;
};

// UPDATE
const updateHistoricoDao = async (id, dataToUpdate) => {
  const updatedHistorico = await prisma.Historico.update({
    where: { idHistorico: id },
    data: {
      ...dataToUpdate,
    },
  });

  return updatedHistorico;
};

// DELETE
const deleteHistoricoDao = async (id) => {
  await prisma.Historico.delete({
    where: { idHistorico: id },
  });
};

module.exports = {
  getAllHistoricosDao,
  getHistoricoByIdDao,
  createHistoricoDao,
  updateHistoricoDao,
  deleteHistoricoDao,
};
