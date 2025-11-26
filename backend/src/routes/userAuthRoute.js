const { Router } = require('express');
const { 
  loginHandler, 
  registerHandler 
} = require('../controllers/userAuthController');

const router = Router();

router.post('/login', loginHandler);
router.post('/register', registerHandler);

module.exports = router;