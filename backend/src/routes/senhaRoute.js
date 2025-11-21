// ./src/router/senha.routes.js

const { Router } = require('express');
const { getAllSenhasHandler, getSenhaByIdHandler, createSenhaHandler, updateSenhaHandler, deleteSenhaHandler, callNextSenhaHandler } = require('../controllers/senhaController');
const router = Router();

router.get('/', getAllSenhasHandler);
router.get('/:id', getSenhaByIdHandler);
router.post('/', createSenhaHandler);
router.put('/:id', updateSenhaHandler);
router.delete('/:id', deleteSenhaHandler);
router.post('/chamar', callNextSenhaHandler);

module.exports = router;