// ./src/router/senha.routes.js

const { Router } = require('express');
const { createSenhaHandler, callNextSenha, completeSenha, getAllSenha, getByIdSenha, removeSenha } = require('../controllers/senhaController');
const router = Router();



// Rotas do Totem (Criação)
router.post('/', createSenhaHandler);
router.post('/chamar', callNextSenha);
router.put('/:id/concluir', completeSenha);
router.get('/', getAllSenha);
router.get('/:id', getByIdSenha);
router.delete('/:id', removeSenha);

module.exports = router;