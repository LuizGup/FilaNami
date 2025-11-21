const prisma = require('../prisma');
const { StatusSenha } = require('@prisma/client');

const selectAllSenhas = async (where, orderBy, take) => {
  return prisma.senha.findMany({
    where: where,
    orderBy: orderBy,
    take: take,
  });
};

const selectSenhaById = async (idSenha) => {
  return prisma.senha.findUnique({
    where: { idSenha: Number(idSenha) },
    include: { guicheAtendente: true },
  });
};

const insertSenha = async (data) => {
  return prisma.senha.create({
    data: data,
  });
};

const updateSenha = async (idSenha, data) => {
  return prisma.senha.update({
    where: { idSenha: Number(idSenha) },
    data: data,
  });
};

const deleteSenha = async (idSenha) => {
  return prisma.senha.delete({
    where: { idSenha: Number(idSenha) },
  });
};

const callNext = async (idSenha, idGuiche) => {
  return prisma.$transaction(async (tx) => {
    const senhaChamada = await tx.senha.update({
      where: { idSenha: idSenha },
      data: {
        status: StatusSenha.EM_ATENDIMENTO,
        idGuicheAtendente: idGuiche,
      },
      include: { guicheAtendente: true },
    });

    await tx.historico.create({
      data: {
        idGuiche: idGuiche,
        idSenha: idSenha,
      },
    });

    return senhaChamada;
  });
};

module.exports = {
  selectAllSenhas,
  selectSenhaById,
  insertSenha,
  updateSenha,
  deleteSenha,
  callNext,
};
