// ./src/router/senha.routes.js

const { Router } = require('express');
const { getAllSenhasHandler, getSenhaByIdHandler, createSenhaHandler, updateSenhaHandler, deleteSenhaHandler, callNextSenhaHandler, processarAtendimentoHandler, getHistoricoGuicheHandler } = require('../controllers/senhaController');
const router = Router();

router.get('/', getAllSenhasHandler);
router.get('/:id', getSenhaByIdHandler);
router.post('/', createSenhaHandler);
router.put('/:id', updateSenhaHandler);
router.put('/:id/concluir', processarAtendimentoHandler);
router.delete('/:id', deleteSenhaHandler);
router.post('/chamar', callNextSenhaHandler);
router.get('/historico/:idGuiche', getHistoricoGuicheHandler);

module.exports = router;