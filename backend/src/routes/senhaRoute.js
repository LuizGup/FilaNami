// ./src/router/senha.routes.js

const { Router } = require('express');
const { createSenhaHandler, 
    callNextSenhaHandler, 
    completeSenhaHandler, 
    getAllSenhaHandler, 
    getByIdSenhaHandler, 
    removeSenhaHandler } = require('../controllers/senhaController');
const router = Router();



// Rotas do Totem (Criação)
router.post('/', createSenhaHandler);
router.post('/chamar', callNextSenhaHandler);
router.put('/:id/concluir', completeSenhaHandler);
router.get('/', getAllSenhaHandler);
router.get('/:id', getByIdSenhaHandler);
router.delete('/:id', removeSenhaHandler);

module.exports = router;