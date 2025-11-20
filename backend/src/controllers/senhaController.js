const { createSenha, callNext, complete, selectAllSenhas, selectSenhaById, deleteSenha } = require('../repositories/senhaDao'); // Nome do arquivo mudou
const { Prioridade, StatusSenha } = require('@prisma/client');

/**
 * POST /api/senhas
 */
const createSenhaHandler = async (req, res) => {
  try {
    let { setorDestino, prioridade } = req.body;

    // --- LÓGICA DE NEGÓCIO: Validação ---
    if (!setorDestino || !prioridade) {
      return res
        .status(400)
        .json({ error: 'setorDestino e prioridade são obrigatórios.' });
    }
    prioridade = prioridade.toUpperCase();
    if (!Object.values(Prioridade).includes(prioridade)) {
      return res.status(400).json({
        error: 'Prioridade inválida. Use COMUM, PRIORIDADE ou PLUSEIGHTY.',
      });
    }

    // --- LÓGICA DE NEGÓCIO: Cálculo da Senha (Prefixo) ---
    let prefixo;
    switch (prioridade) {
      case Prioridade.PRIORIDADE:
        prefixo = 'P';
        break;
      case Prioridade.PLUSEIGHTY:
        prefixo = 'E';
        break;
      case Prioridade.COMUM:
      default:
        prefixo = 'C';
        break;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // --- [ INÍCIO DA MUDANÇA ] ---
    // LÓGICA DE NEGÓCIO: Gerar número aleatório com checagem de colisão

    let novaSenhaStr;
    let numeroFormatado;
    let tentativas = 0;
    const MAX_TENTATIVAS = 100; // Segurança contra loop infinito

    while (true) {
      // Para o loop se tentar 100x e não conseguir (evita loop infinito)
      if (tentativas++ > MAX_TENTATIVAS) {
        throw new Error("Não foi possível gerar um número de senha único após 100 tentativas.");
      }
      
      // 1. Gera um número aleatório (0 a 999)
      const novoNumero = Math.floor(Math.random() * 1000);
      numeroFormatado = novoNumero.toString().padStart(3, '0');
      novaSenhaStr = `${prefixo}${numeroFormatado}`; // Ex: "C451"

      // 2. Define o filtro para checar se essa senha exata já existe HOJE
      const whereCheck = {
        senha: novaSenhaStr,
        dataEmissao: { gte: hoje },
      };

      // 3. Chama o DAO 'selectAllSenhas' para verificar
      // (O seu código original estava sem o 'SenhaService.', estou assumindo que
      // a função 'selectAllSenhas' é a do service)
      const senhasExistentes = await selectAllSenhas(whereCheck, {}, 1); // take: 1

      // 4. Se não encontrou nenhuma (length 0), o número é válido
      if (senhasExistentes.length === 0) {
        break; // Número é único, sai do loop
      }
      
      // Se 'senhasExistentes.length' > 0, o loop roda de novo
    }
    // --- [ FIM DA MUDANÇA ] ---


    // --- LÓGICA DE NEGÓCIO: Montagem do objeto final ---
    const data = {
      setorDestino: setorDestino,
      prioridade: prioridade,
      senha: novaSenhaStr, // Usa a senha aleatória gerada
      status: StatusSenha.AGUARDANDO,
      setorAtual: setorDestino,
    };

    // 3. Chama o DAO 'createSenha' para salvar
    // (Também assumindo que 'createSenha' é a função do service)
    const novaSenha = await createSenha(data);

    // Emissão do Socket.IO
    if (req.io) {
      req.io.emit('senhaUpdate', { action: 'createSenha', data: novaSenha });
    } else {
      console.error("CONTROLLER ERRO: 'req.io' está UNDEFINED!");
    }

    res.status(201).json(novaSenha);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao gerar senha.', details: error.message });
  }
};

/**
 * POST /api/senhas/chamar
 */
const callNextSenhaHandler = async (req, res) => {
  try {
    const { idGuiche, setor } = req.body;

    if (!idGuiche || !setor) {
      return res
        .status(400)
        .json({ error: 'idGuiche e setor são obrigatórios.' });
    }

    // --- LÓGICA DE NEGÓCIO: Buscar próxima senha ---
    // 1. Define os filtros para a busca
    const where = {
      status: StatusSenha.AGUARDANDO,
      setorAtual: setor,
    };
    const orderBy = [
      { prioridade: 'desc' }, // 'PRIORIDADE' e 'PLUSEIGHTY' vêm antes
      { dataEmissao: 'asc' }, // A mais antiga primeiro
    ];

    // 2. Chama o DAO 'selectAllSenhas' genérico para buscar
    const proximasSenhas = await selectAllSenhas(where, orderBy, 1);
    const proximaSenha = proximasSenhas[0];

    // --- LÓGICA DE NEGÓCIO: Validação de Fila ---
    if (!proximaSenha) {
      return res
        .status(404)
        .json({ message: 'Nenhuma senha aguardando neste setor.' });
    }

    // 3. Chama o DAO 'callNext' (transação)
    // Note a mudança: passamos o idSenha e idGuiche
    const senhaChamada = await callNext(
      proximaSenha.idSenha,
      Number(idGuiche)
    );

    // Emissão do Socket.IO
    if (req.io && senhaChamada) {
      req.io.emit('senhaUpdate', { action: 'update', data: senhaChamada });
    } else if (!req.io) {
      console.error("CONTROLLER ERRO: 'req.io' está UNDEFINED!");
    }

    res.status(200).json(senhaChamada);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao chamar senha.', details: error.message });
  }
};

/**
 * PUT /api/senhas/:id/concluir
 */
const completeSenhaHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // --- LÓGICA DE NEGÓCIO: Definição do payload de update ---
    const data = {
      status: StatusSenha.CONCLUIDO,
      dataConclusao: new Date(),
    };

    // 1. Chama o DAO 'complete' (update genérico)
    const senha = await complete(Number(id), data);

    // Emissão do Socket.IO
    if (req.io) {
      req.io.emit('senhaUpdate', { action: 'update', data: senha });
    } else {
      console.error(
        "CONTROLLER ERRO: 'req.io' está UNDEFINED (em complete)!"
      );
    }

    res.status(200).json(senha);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao concluir senha.', details: error.message });
  }
};

/**
 * GET /api/senhas
 */
const getAllSenhaHandler = async (req, res) => {
  try {
    const { status, setor } = req.query;

    // --- LÓGICA DE NEGÓCIO: Construção dos filtros ---
    const where = {};
    if (status) where.status = status;
    if (setor) where.setorAtual = setor;

    const orderBy = { dataEmissao: 'desc' };

    // 1. Chama o DAO 'selectAllSenhas' genérico
    const senhas = await selectAllSenhas(where, orderBy);
    res.status(200).json(senhas);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao listar senhas.', details: error.message });
  }
};

/**
 * GET /api/senhas/:id
 */
const getByIdSenhaHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Chama o DAO 'selectSenhaById'
    const senha = await selectSenhaById(Number(id));

    // --- LÓGICA DE NEGÓCIO: Validação de existência ---
    if (!senha) {
      return res.status(404).json({ message: 'Senha não encontrada.' });
    }
    res.status(200).json(senha);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao buscar senha.', details: error.message });
  }
};
const removeSenhaHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const idNum = Number(id);

    // 1. Chama o DAO 'deleteSenha'
    // O Prisma retorna o objeto que foi deletado
    const senhaDeletada = await deleteSenha(idNum);

    // --- LÓGICA DE NEGÓCIO: Emissão do Socket.IO ---
    if (req.io) {
      console.log(
        "CONTROLLER: 'req.io' encontrado. Emitindo 'senhaUpdate' (delete)..."
      );
      // Avisa aos clientes que esta senha foi removida
      req.io.emit('senhaUpdate', {
        action: 'delete',
        data: senhaDeletada,
      });
    } else {
      console.error(
        "CONTROLLER ERRO: 'req.io' está UNDEFINED (em deleteSenha)!"
      );
    }

    res.status(200).json(senhaDeletada); // Retorna a senha que foi apagada
  } catch (error) {
    // Código de erro comum do Prisma para "Registro não encontrado"
    if (error.code === 'P2025') {
      return res
        .status(404)
        .json({ message: 'Senha não encontrada para deletar.' });
    }
    res
      .status(500)
      .json({ error: 'Erro ao deletar senha.', details: error.message });
  }
};

module.exports = {
  createSenhaHandler,
  callNextSenhaHandler,
  completeSenhaHandler,
  getAllSenhaHandler,
  getByIdSenhaHandler,
  removeSenhaHandler,
};