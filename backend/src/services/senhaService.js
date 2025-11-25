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
  const { status, setor, idGuiche } = filters; 
  const where = {};

  if (status) where.status = status;
  if (setor) where.setorAtual = setor;
  
  if (idGuiche) where.idGuicheAtendente = Number(idGuiche); 

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

const callNextService = async (idGuiche, setor, io) => {
  if (!idGuiche || !setor) {
    throw new Error('CAMPOS_OBRIGATORIOS: idGuiche e setor são obrigatórios.');
  }

  console.log(`[CALL NEXT] Guichê ${idGuiche} chamando no setor ${setor}...`);

  try {
    const activeWhere = {
        idGuicheAtendente: Number(idGuiche),
        status: StatusSenha.EM_ATENDIMENTO
    };
    
    const activeTickets = await selectAllSenhas(activeWhere, {}, 10); 

    if (activeTickets.length > 0) {
        for (const ticketAnterior of activeTickets) {
            // Verifica se o paciente ainda tem que ir para outro lugar
            const precisaEncaminhar = ticketAnterior.setorDestino && 
                                      (ticketAnterior.setorDestino !== ticketAnterior.setorAtual);

            if (precisaEncaminhar) {
                // Encaminha
                console.log(`➡️ Encaminhando ${ticketAnterior.senha}: ${ticketAnterior.setorAtual} -> ${ticketAnterior.setorDestino}`);
                const senhaEncaminhada = await updateSenha(ticketAnterior.idSenha, {
                    status: StatusSenha.AGUARDANDO,
                    setorAtual: ticketAnterior.setorDestino,
                    idGuicheAtendente: null
                });
                if (io) io.emit('senhaUpdate', { action: 'createSenha', data: senhaEncaminhada });
            } 
            else {
                // Conclui
                console.log(`✅ Concluindo atendimento de ${ticketAnterior.senha}`);
                const senhaConcluida = await updateSenha(ticketAnterior.idSenha, {
                    status: StatusSenha.CONCLUIDO,
                    dataConclusao: new Date()
                });
                if (io) io.emit('senhaUpdate', { action: 'update', data: senhaConcluida });
            }
        }
    }
  } catch (err) {
      console.error("Erro ao limpar guichê anterior:", err);
  }

  const ORDEM_DE_CHAMADA = [
      Prioridade.PLUSEIGHTY,  
      Prioridade.PRIORIDADE,  
      Prioridade.COMUM        
  ];

  let nextTicket = null;

  for (const prioridadeAtual of ORDEM_DE_CHAMADA) {
      const where = {
          status: StatusSenha.AGUARDANDO,
          setorAtual: String(setor),
          prioridade: prioridadeAtual 
      };

      const orderBy = { dataEmissao: 'asc' };

      const ticketsEncontrados = await selectAllSenhas(where, orderBy, 1);

      if (ticketsEncontrados.length > 0) {
          nextTicket = ticketsEncontrados[0];
          console.log(`🎯 Encontrado ticket de prioridade ${prioridadeAtual}: ${nextTicket.senha}`);
          break; 
      }
  }

  if (!nextTicket) {
    throw new Error('FILA_VAZIA: Nenhuma senha aguardando neste setor.');
  }

  console.log(`📢 Chamando ${nextTicket.senha} para Guichê ${idGuiche}`);
  
  const senhaChamada = await callNext(nextTicket.idSenha, Number(idGuiche));
  
  if (io) io.emit('senhaUpdate', { action: 'update', data: senhaChamada });

  return senhaChamada;
};

module.exports = {
  getAllSenhas,
  getSenhaById,
  createSenha,
  updateSenhaData,
  removeSenha,
  callNextService,
};