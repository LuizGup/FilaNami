// ./src/router/senha.routes.js

const { Router } = require('express');
const { createSenha, callNextSenha, completeSenha, getAllSenha, getByIdSenha, removeSenha } = require('../controllers/senhaController');
const router = Router();

// --- Definição das Rotas de Senha ---

// Rotas do Totem (Criação)
router.post('/', createSenha);

// Rotas do Guichê (Chamada e Conclusão)
router.post('/chamar', callNextSenha);
router.put('/:id/concluir', completeSenha);

// Rotas de Monitoramento/Listagem
router.get('/', getAllSenha);
router.get('/:id', getByIdSenha);

// Rota para remoção de senha
router.delete('/:id', removeSenha);

module.exports = router;