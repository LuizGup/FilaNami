// ./src/router/senha.routes.js

const { Router } = require('express');
const { create, callNext, complete, getAll, getById } = require('../controllers/senhaController');
const router = Router();

// --- Definição das Rotas de Senha ---

// Rotas do Totem (Criação)
router.post('/', create);

// Rotas do Guichê (Chamada e Conclusão)
router.post('/chamar', callNext);
router.put('/:id/concluir', complete);

// Rotas de Monitoramento/Listagem
router.get('/', getAll);
router.get('/:id', getById);

// (Opcional: Rota de cancelamento)
// router.delete('/:id/cancelar', cancel); // Você precisaria adicionar a função 'cancel' no controller

module.exports = router;