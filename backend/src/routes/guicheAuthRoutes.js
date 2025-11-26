// src/routes/guicheAuthRoutes.js
const express = require("express");
const router = express.Router();

const { loginGuicheHandler } = require("../controllers/guicheAuthController");

// POST /api/guiches/auth/login
router.post("/login", loginGuicheHandler);

module.exports = router;
