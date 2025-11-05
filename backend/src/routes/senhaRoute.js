// ./src/router/senha.routes.js

const { Router } = require('express');
const SenhaController = require('../controllers/senhaController');

const router = Router();

// --- Definição das Rotas de Senha ---

// Rotas do Totem (Criação)
router.post('/', SenhaController.create);

// Rotas do Guichê (Chamada e Conclusão)
router.post('/chamar', SenhaController.callNext);
router.put('/:id/concluir', SenhaController.complete);

// Rotas de Monitoramento/Listagem
router.get('/', SenhaController.getAll);
router.get('/:id', SenhaController.getById);

// (Opcional: Rota de cancelamento)
// router.delete('/:id/cancelar', SenhaController.cancel); // Você precisaria adicionar a função 'cancel' no controller

module.exports = router;