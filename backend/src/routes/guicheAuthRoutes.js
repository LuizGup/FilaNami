const express = require("express");
const router = express.Router();

const { loginGuicheHandler } = require("../controllers/guicheAuthController");

// Rota base: /guiches/auth/login (por exemplo)
router.post("/login", loginGuicheHandler);

module.exports = router;
