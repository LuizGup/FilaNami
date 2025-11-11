// ./src/controllers/senha.controller.js

const SenhaService = require('../services/senhaService');
const { Prioridade } = require('@prisma/client');

  /**
   * POST /api/senhas
   */
  const create = async (req, res) => {
    try {
      let { setorDestino, prioridade } = req.body;
      
      // Validações (exemplo)
      if (!setorDestino || !prioridade) {
        return res.status(400).json({ error: 'setorDestino e prioridade são obrigatórios.' });
      }
      prioridade = prioridade.toUpperCase();
      if (!Object.values(Prioridade).includes(prioridade)) {
        return res.status(400).json({ 
          error: 'Prioridade inválida. Use COMUM, PRIORIDADE ou PLUSEIGHTY.' 
        });
      }
      
      const novaSenha = await SenhaService.create({ setorDestino, prioridade }); 
      
      // --- LOG DE DEBUG ---
      if (req.io) {
        console.log("CONTROLLER: 'req.io' encontrado. Emitindo 'senhaUpdate' (create)...");
        req.io.emit('senhaUpdate', { action: 'create', data: novaSenha });
      } else {
        console.error("CONTROLLER ERRO: 'req.io' está UNDEFINED!");
      }
      // --- FIM DO LOG ---

      res.status(201).json(novaSenha);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao gerar senha.', details: error.message });
    }
  }

  /**
   * POST /api/senhas/chamar
   */
  const callNext = async (req, res) => {
    try {
      const { idGuiche, setor } = req.body;
      
      if (!idGuiche || !setor) {
        return res.status(400).json({ error: 'idGuiche e setor são obrigatórios.' });
      }

      const senhaChamada = await SenhaService.callNext(Number(idGuiche), setor);

      // --- LOG DE DEBUG ---
      if (req.io && senhaChamada) {
        console.log("CONTROLLER: 'req.io' encontrado. Emitindo 'senhaUpdate' (update/callNext)...");
        req.io.emit('senhaUpdate', { action: 'update', data: senhaChamada });
      } else if (!req.io) {
        console.error("CONTROLLER ERRO: 'req.io' está UNDEFINED!");
      }
      // --- FIM DO LOG ---

      res.status(200).json(senhaChamada);
    } catch (error) {
        if (error.message.includes('Nenhuma senha')) {
          return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ error: 'Erro ao chamar senha.', details: error.message });
    }
  }

  /**
   * PUT /api/senhas/:id/concluir
   */
  const complete = async(req, res) => {
    try {
      const { id } = req.params; // 'id' aqui é só o nome do parâmetro da rota
      const senha = await SenhaService.complete(Number(id)); // Passamos o valor

      // --- ATUALIZAÇÃO DO SOCKET.IO ---
      // Emite um evento para todos os clientes conectados
      if (req.io) {
        console.log("CONTROLLER: 'req.io' encontrado. Emitindo 'senhaUpdate' (update/complete)...");
        req.io.emit('senhaUpdate', { action: 'update', data: senha });
      } else {
        console.error("CONTROLLER ERRO: 'req.io' está UNDEFINED (em complete)!");
      }
      // --- FIM DA ATUALIZAÇÃO ---

      res.status(200).json(senha);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao concluir senha.', details: error.message });
    } // <--- O "L" FOI REMOVIDO DAQUI
  }

  /**
   * GET /api/senhas
   */
  const getAll = async(req, res) => {
    try {
      const { status, setor } = req.query;
      const senhas = await SenhaService.getAll(status, setor);
      res.status(200).json(senhas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar senhas.', details: error.message });
    }
  }

  /**
   * GET /api/senhas/:id
   */
  const getById = async (req, res) => {
    try {
    const { id } = req.params; // 'id' é o nome do parâmetro
      const senha = await SenhaService.getById(Number(id)); // Passamos o valor
      if (!senha) {
        return res.status(404).json({ message: 'Senha não encontrada.' });
      }
      res.status(200).json(senha);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar senha.', details: error.message });
    }
  }

module.exports = {
  create,
  callNext,
  complete, 
  getAll,
  getById,
}