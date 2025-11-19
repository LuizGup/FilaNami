const prisma = require('../prisma');
const { StatusSenha } = require('@prisma/client');

const createSenha = async (data) => {
  // O 'data' agora vem completo do controller
  return prisma.senha.create({
    data: data,
  });
};

/**
 * REQUISITO 2: Chamar próxima senha
 * (Agora é um DAO de transação: recebe o idSenha do controller)
 */
const callNext = async (idSenha, idGuiche) => {
  // O controller fez a lógica de "findNext"
  // O service apenas executa a transação de "atendimento"
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

/**
 * Concluir um atendimento (ou qualquer update)
 * (Agora é um DAO de update genérico)
 */
const complete = async (idSenha, data) => {
  // O controller decide o que será atualizado (o 'data')
  return prisma.senha.update({
    where: { idSenha: Number(idSenha) },
    data: data,
  });
};

/**
 * Buscar por ID
 * (Já era um DAO)
 */
const findSenhaById = async (idSenha) => {
  return prisma.senha.findUnique({
    where: { idSenha: Number(idSenha) },
    include: { guicheAtendente: true },
  });
};

/**
 * Listar todos com filtros
 * (Agora é um DAO de busca genérico: recebe where, orderBy e take)
 */
const findAllSenhas = async (where, orderBy, take) => {
  return prisma.senha.findMany({
    where: where,
    orderBy: orderBy,
    take: take, // 'take' é usado para limitar resultados (ex: 'pegar só 1')
  });
};
const deleteSenha = async (idSenha) => {
  return prisma.senha.delete({
    where: { idSenha: Number(idSenha) },
  });
};

module.exports = {
  createSenha,
  callNext,
  complete,
  findSenhaById,
  findAllSenhas,
  deleteSenha,
};
