// ./src/controllers/senha.controller.js

const SenhaService = require('../services/senhaService');
const { Prioridade } = require('@prisma/client');

class SenhaController {

  /**
   * POST /api/senhas
   */
  async create(req, res) {
    try {
      // -> [MUDANÇA] 'setor_destino' agora é 'setorDestino'
      let { setorDestino, prioridade } = req.body; 

      // -> [MUDANÇA] Verificando 'setorDestino'
      if (!setorDestino || !prioridade) {
        return res.status(400).json({ error: 'setorDestino e prioridade são obrigatórios.' });
      }

      prioridade = prioridade.toUpperCase(); 
      
      if (!Object.values(Prioridade).includes(prioridade)) {
        return res.status(400).json({ 
          error: 'Prioridade inválida. Use COMUM, PRIORIDADE ou PLUSEIGHTY.' 
        });
      }
      
      // -> [MUDANÇA] Passando 'setorDestino' para o service
      const novaSenha = await SenhaService.create({ setorDestino, prioridade }); 
      res.status(201).json(novaSenha);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao gerar senha.', details: error.message });
    }
  }

  /**
   * POST /api/senhas/chamar
   */
  async callNext(req, res) {
    try {
      // -> [MUDANÇA] 'id_guiche' agora é 'idGuiche'
      const { idGuiche, setor } = req.body;

      // -> [MUDANÇA] Verificando 'idGuiche'
      if (!idGuiche || !setor) {
        return res.status(400).json({ error: 'idGuiche e setor são obrigatórios.' });
      }

      // -> [MUDANÇA] Passando 'idGuiche'
      const senhaChamada = await SenhaService.callNext(Number(idGuiche), setor);
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
  async complete(req, res) {
    try {
      const { id } = req.params; // 'id' aqui é só o nome do parâmetro da rota
      const senha = await SenhaService.complete(Number(id)); // Passamos o valor
      res.status(200).json(senha);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao concluir senha.', details: error.message });
    }
  }

  /**
   * GET /api/senhas
   */
  async getAll(req, res) {
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
  async getById(req, res) {
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
}

module.exports = new SenhaController();