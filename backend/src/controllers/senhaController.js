const {
  getAllSenhas,
  getSenhaById,
  createSenha,
  updateSenhaData,
  removeSenha,
  callNextService,
  getHistoricoDoGuiche,
  getHistoricoDoUsuario,
  processarAtendimento,
  getHistoricoPorGuiche,
} = require('../services/senhaService');

const createSenhaHandler = async (req, res) => {
  try {
    const { setorDestino, prioridade } = req.body;

    const novaSenha = await createSenha(setorDestino, prioridade);

    if (req.io) {
      req.io.emit('senhaUpdate', { action: 'createSenha', data: novaSenha });
    }

    res.status(201).json(novaSenha);
  } catch (error) {
    if (error.message.includes('CAMPOS_OBRIGATORIOS') || error.message.includes('PRIORIDADE_INVALIDA')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro ao gerar senha.', details: error.message });
  }
};

const callNextSenhaHandler = async (req, res) => {
  try {
    const { idGuiche, setor } = req.body;

    // AQUI: Passamos 'req.io' como terceiro argumento
    const senhaChamada = await callNextService(idGuiche, setor, req.io);

    // Esse socket avisa sobre a NOVA senha (que entrou em atendimento)
    if (req.io) {
      req.io.emit('senhaUpdate', { action: 'update', data: senhaChamada });
    }

    res.status(200).json(senhaChamada);
  } catch (error) {
    if (error.message.includes('FILA_VAZIA')) {
      return res.status(404).json({ message: 'Nenhuma senha aguardando neste setor.' });
    }
    if (error.message.includes('CAMPOS_OBRIGATORIOS')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Erro ao chamar senha.', details: error.message });
  }
};

const updateSenhaHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const senha = await updateSenhaData(id);

    if (req.io) {
      req.io.emit('senhaUpdate', { action: 'update', data: senha });
    }

    res.status(200).json(senha);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao concluir senha.', details: error.message });
  }
};

const getAllSenhasHandler = async (req, res) => {
  try {
    const senhas = await getAllSenhas(req.query);
    res.status(200).json(senhas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar senhas.', details: error.message });
  }
};


const getSenhaByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const senha = await getSenhaById(id);
    res.status(200).json(senha);
  } catch (error) {
    if (error.message.includes('NAO_ENCONTRADO')) {
      return res.status(404).json({ message: 'Senha não encontrada.' });
    }
    res.status(500).json({ error: 'Erro ao buscar senha.', details: error.message });
  }
};

const deleteSenhaHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const senhaDeletada = await removeSenha(id);

    if (req.io) {
      req.io.emit('senhaUpdate', { action: 'delete', data: senhaDeletada });
    }

    res.status(200).json(senhaDeletada);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Senha não encontrada para deletar.' });
    }
    res.status(500).json({ error: 'Erro ao deletar senha.', details: error.message });
  }
};
const getHistoricoGuicheHandler = async (req, res) => {
  try {
    // MUDANÇA AQUI: req.params em vez de req.query
    const { idGuiche } = req.params;

    if (!idGuiche) {
      return res.status(400).json({ error: "ID do Guichê é obrigatório na URL." });
    }

    // Chama o service normalmente
    const historico = await getHistoricoPorGuiche(idGuiche);

    res.status(200).json(historico);
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ error: 'Erro ao buscar histórico.', details: error.message });
  }
};

const processarAtendimentoHandler = async (req, res) => {
  try {
    // O nome aqui 'id' TEM QUE SER IGUAL ao nome na rota (/:id/concluir)
    const { id } = req.params; 

    console.log("Controller recebeu ID:", id); // <--- Debug

    if (!id) {
        return res.status(400).json({ error: "ID da senha não fornecido na URL." });
    }

    // Chama o service passando o ID convertido para Número
    const senhaProcessada = await processarAtendimento(Number(id));

    // Emite o Socket para atualizar as telas
    if (req.io) {
      // Se virou AGUARDANDO, é como se tivesse "nascido" na outra fila (createSenha)
      // Se virou CONCLUIDO, é um update
      const action = senhaProcessada.status === 'AGUARDANDO' ? 'createSenha' : 'update';
      
      req.io.emit('senhaUpdate', { 
        action: action, 
        data: senhaProcessada 
      });
    }

    res.status(200).json(senhaProcessada);
  } catch (error) {
    console.error("Erro ao processar atendimento:", error);
    res.status(500).json({ error: 'Erro ao processar senha.', details: error.message });
  }
};
module.exports = {
  getAllSenhasHandler,
  getSenhaByIdHandler,
  createSenhaHandler,
  updateSenhaHandler,
  deleteSenhaHandler,
  callNextSenhaHandler,
  getHistoricoGuicheHandler,
  processarAtendimentoHandler
};