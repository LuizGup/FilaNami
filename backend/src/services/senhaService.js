const { Prioridade, StatusSenha } = require('@prisma/client');
const { selectAllSenhas, selectSenhaById, insertSenha, updateSenha, deleteSenha, callNext } = require('../repositories/senhaDao');

const getPrefixByPriority = (prioridade) => {
  const prefixes = {
    [Prioridade.PRIORIDADE]: 'P',
    [Prioridade.PLUSEIGHTY]: 'E',
    [Prioridade.COMUM]: 'C'
  };
  return prefixes[prioridade] || 'C';
};

const generateRandomUniqueTicket = async (prioridade) => {
  const prefix = getPrefixByPriority(prioridade);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usedTickets = await selectAllSenhas({
    senha: { startsWith: prefix },
    dataEmissao: { gte: today },
  }, {});

  const usedNumbersSet = new Set(
    usedTickets.map(t => parseInt(t.senha.replace(prefix, ''), 10))
  );

  const availableNumbers = [];
  for (let i = 0; i < 1000; i++) {
    if (!usedNumbersSet.has(i)) {
      availableNumbers.push(i);
    }
  }

  if (availableNumbers.length === 0) {
    throw new Error('ESGOTADO: Todas as senhas (000-999) para esta prioridade foram usadas hoje.');
  }

  const randomIndex = Math.floor(Math.random() * availableNumbers.length);
  const winnerNumber = availableNumbers[randomIndex];

  const numberFormatted = winnerNumber.toString().padStart(3, '0');
  return `${prefix}${numberFormatted}`;
};

const getAllSenhas = async (filters) => {
  const { status, setor } = filters;
  const where = {};

  if (status) where.status = status;
  if (setor) where.setorAtual = setor;

  return await selectAllSenhas(where, { dataEmissao: 'desc' });
};

const getSenhaById = async (id) => {
  const senha = await selectSenhaById(Number(id));
  if (!senha) {
    throw new Error('NAO_ENCONTRADO: Senha não encontrada.');
  }
  return senha;
};

const createSenha = async (setorDestino, prioridade) => {
  if (!setorDestino || !prioridade) {
    throw new Error('CAMPOS_OBRIGATORIOS: setorDestino e prioridade são obrigatórios.');
  }

  const priorityUpper = prioridade.toUpperCase();
  if (!Object.values(Prioridade).includes(priorityUpper)) {
    throw new Error('PRIORIDADE_INVALIDA: Prioridade inválida.');
  }

  const ticketCode = await generateRandomUniqueTicket(priorityUpper);

  const data = {
    setorDestino,
    prioridade: priorityUpper,
    senha: ticketCode,
    status: StatusSenha.AGUARDANDO,
    setorAtual: 'Atendimento', 
  };

  return await insertSenha(data);
};

const updateSenhaData = async (id, dataToUpdate) => {
  const idNumber = Number(id);
  
  if (!dataToUpdate) {
    return await updateSenha(idNumber, {
      status: StatusSenha.CONCLUIDO,
      dataConclusao: new Date(),
    });
  }
  return await updateSenha(idNumber, dataToUpdate);
};

const removeSenha = async (id) => {
  return await deleteSenha(Number(id));
};

const callNextService = async (idGuiche, setor) => {
  if (!idGuiche || !setor) {
    throw new Error('CAMPOS_OBRIGATORIOS: idGuiche e setor são obrigatórios.');
  }

  const where = {
    status: StatusSenha.AGUARDANDO,
    setorAtual: setor,
  };

  const orderBy = [
    { prioridade: 'desc' },
    { dataEmissao: 'asc' },
  ];

  const nextTickets = await selectAllSenhas(where, orderBy, 1);
  const nextTicket = nextTickets[0];

  if (!nextTicket) {
    throw new Error('FILA_VAZIA: Nenhuma senha aguardando neste setor.');
  }

  return await callNext(nextTicket.idSenha, Number(idGuiche));
};

module.exports = {
  getAllSenhas,
  getSenhaById,
  createSenha,
  updateSenhaData,
  removeSenha,
  callNextService,
};