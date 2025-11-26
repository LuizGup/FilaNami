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
  // Segurança extra: se chegar undefined aqui, o Prisma explode.
  if (!idSenha) return null; 

  return prisma.senha.findUnique({
    where: { 
      idSenha: Number(idSenha) // Garante que é Int pro Prisma
    },
    include: {
      guicheAtendente: true
    }
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

const callNext = async (idSenha, idGuiche, idAtendente) => {
  return prisma.$transaction(async (tx) => {
    const senhaChamada = await tx.senha.update({
      where: { idSenha: idSenha },
      data: {
        status: 'EM_ATENDIMENTO',
        idGuicheAtendente: idGuiche,
        idUsuario: idAtendente, // <--- SALVA QUEM ESTÁ ATENDENDO
      },
      include: { guicheAtendente: true },
    });

    // Opcional: Se quiser salvar no histórico também
    await tx.historico.create({
      data: {
        idGuiche: idGuiche,
        idSenha: idSenha,
        // idUsuario: idAtendente // Se tiver essa coluna no historico
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
