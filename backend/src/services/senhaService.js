const { Prioridade, StatusSenha } = require('@prisma/client');
const { selectAllSenhas, selectSenhaById, insertSenha, updateSenha, deleteSenha, callNext } = require('../repositories/senhaDao');
const prisma = require('../prisma');

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
  if (!dataToUpdate || Object.keys(dataToUpdate).length === 0) {
     throw new Error("Nenhum dado fornecido para atualização.");
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

  // 1. Limpeza do Anterior
  try {
    const activeWhere = {
        idGuicheAtendente: Number(idGuiche),
        status: StatusSenha.EM_ATENDIMENTO
    };
    
    const activeTickets = await selectAllSenhas(activeWhere, {}, 10); 

    if (activeTickets.length > 0) {
        for (const ticketAnterior of activeTickets) {
            const precisaEncaminhar = ticketAnterior.setorDestino && 
                                      (ticketAnterior.setorDestino !== ticketAnterior.setorAtual);

            if (precisaEncaminhar) {
                console.log(`➡️ Encaminhando ${ticketAnterior.senha}`);
                const senhaEncaminhada = await updateSenha(ticketAnterior.idSenha, {
                    status: StatusSenha.AGUARDANDO,
                    setorAtual: ticketAnterior.setorDestino,
                    idGuicheAtendente: null,  
                });
                if (io) io.emit('senhaUpdate', { action: 'createSenha', data: senhaEncaminhada });
            } else {
                console.log(`✅ Concluindo ${ticketAnterior.senha}`);
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

  // 2. Busca Próximo
  const ORDEM_DE_CHAMADA = [Prioridade.PLUSEIGHTY, Prioridade.PRIORIDADE, Prioridade.COMUM];
  let nextTicket = null;

  for (const prioridadeAtual of ORDEM_DE_CHAMADA) {
      const where = {
          status: StatusSenha.AGUARDANDO,
          setorAtual: String(setor),
          prioridade: prioridadeAtual 
      };
      const tickets = await selectAllSenhas(where, { dataEmissao: 'asc' }, 1);
      if (tickets.length > 0) {
          nextTicket = tickets[0];
          break; 
      }
  }

  if (!nextTicket) {
    throw new Error('FILA_VAZIA: Nenhuma senha aguardando neste setor.');
  }

  console.log(`📢 Chamando ${nextTicket.senha}`);
  
  // Se tiver idAtendente no futuro, passe aqui. Por enquanto usa só o Guiche.
  const senhaChamada = await callNext(nextTicket.idSenha, Number(idGuiche));
  
  if (io) io.emit('senhaUpdate', { action: 'update', data: senhaChamada });

  return senhaChamada;
};

const getHistoricoPorGuiche = async (idGuiche) => {
  if (!idGuiche) throw new Error("ID do Guichê obrigatório");

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  try {
    // Busca na tabela de LOGS (Historico), não na tabela de Estado Atual (Senha)
    const historicoLog = await prisma.historico.findMany({
      where: {
        idGuiche: Number(idGuiche), // Filtra tudo que passou por ESSE guichê
        // dataAtendimento: { gte: hoje } // (Opcional) Se quiser filtrar por data, verifique o nome da coluna no seu schema Historico
      },
      include: {
        senha: true // Traz os dados da senha (número, prioridade)
      },
      orderBy: {
        // Ajuste 'idHistorico' para o nome da sua chave primária da tabela Historico se for diferente
        idHistorico: 'desc' 
      },
      take: 20
    });

    // Mapeia para o formato que o Frontend espera
    return historicoLog.map(h => ({
      idSenha: h.idSenha,
      senha: h.senha.senha,
      prioridade: h.senha.prioridade,
      setorDestino: h.senha.setorDestino,
      
      // TRUQUE VISUAL:
      // Para o funcionário deste guichê, esse atendimento está "CONCLUIDO" (já passou por ele),
      // mesmo que a senha real esteja "AGUARDANDO" na enfermaria.
      // Isso garante que apareça na coluna verde.
      status: 'CONCLUIDO', 
      
      // Usamos a data do histórico (quando ele atendeu), não a data final da senha
      dataConclusao: h.dataAtendimento || h.data_criacao || new Date(), 
      
      idGuicheAtendente: h.idGuiche
    }));

  } catch (error) {
    console.error("SERVICE ERRO: Falha ao buscar tabela Historico.", error);
    throw error;
  }
};

const completeSenha = async (idSenha) => {
  // 1. Busca a senha para ver o destino dela
  const ticket = await selectSenhaById(idSenha); 

  // 2. Verifica se ela já está no setor de destino
  // Ex: Se está em 'Atendimento' e o destino é 'Exame de Sangue', são diferentes.
  const chegouNoDestino = ticket.setorDestino === ticket.setorAtual;

  if (!chegouNoDestino) {
      // --- CASO A: ENCAMINHAR (Recepção -> Enfermeira) ---
      console.log(`➡️ [MANUAL] Encaminhando ${ticket.senha} para ${ticket.setorDestino}`);
      
      return await updateSenha(idSenha, {
          status: StatusSenha.AGUARDANDO,          // Volta pra fila (da enfermeira)
          setorAtual: ticket.setorDestino,         // Atualiza o setor atual
          idGuicheAtendente: null,                 // Sai da sua mesa
          idUsuario: null                          // Reseta o usuário (para o próximo pegar)
      });
  } else {
      // --- CASO B: CONCLUIR DE FATO (Enfermeira -> Fim) ---
      console.log(`✅ [MANUAL] Finalizando ${ticket.senha}`);
      
      return await updateSenha(idSenha, {
          status: StatusSenha.CONCLUIDO,
          dataConclusao: new Date()
          // Aqui mantém o idUsuario que pegou para fins de histórico
      });
  }
};
const processarAtendimento = async (idRaw) => {
  // 1. Converte e Valida
  const idSenha = Number(idRaw);

  if (!idSenha || isNaN(idSenha)) {
    throw new Error(`ID Inválido: Recebi "${idRaw}" e não consegui converter para número.`);
  }

  // 2. Busca a senha no banco para ver o destino
  const ticket = await selectSenhaById(idSenha);

  if (!ticket) {
    throw new Error(`Senha com ID ${idSenha} não encontrada no banco.`);
  }

  console.log(`[PROCESSAR] Analisando senha ${ticket.senha} (ID: ${idSenha})...`);

  // 3. Lógica de Decisão (Destino vs Atual)
  const chegouNoDestino = ticket.setorDestino === ticket.setorAtual;
  let dadosParaAtualizar = {};

  if (!chegouNoDestino) {
    // --- CASO A: ENCAMINHAR (Ainda tem chão pela frente) ---
    console.log(`➡️ Encaminhando para: ${ticket.setorDestino}`);
    
    dadosParaAtualizar = {
      status: StatusSenha.AGUARDANDO,  // Volta para a fila
      setorAtual: ticket.setorDestino, // O Destino vira o Atual
      
      // --- CORREÇÃO AQUI ---
      // Removemos a linha 'idGuicheAtendente: null'.
      // Assim, o ID do guichê atual (ex: 1) continua salvo na senha 
      // enquanto ela espera no próximo setor.
    };
  } else {
    // --- CASO B: CONCLUIR (Chegou no fim) ---
    console.log(`✅ Concluindo atendimento.`);
    
    dadosParaAtualizar = {
      status: StatusSenha.CONCLUIDO,
      dataConclusao: new Date()
      // Aqui também mantemos o idGuicheAtendente original
    };
  }

  // 4. Executa o Update
  const senhaAtualizada = await updateSenha(idSenha, dadosParaAtualizar);

  return senhaAtualizada;
};

module.exports = {
  getAllSenhas,
  getSenhaById,
  createSenha,
  updateSenhaData,
  removeSenha,
  callNextService,
  getHistoricoPorGuiche,
  completeSenha,
  processarAtendimento
};