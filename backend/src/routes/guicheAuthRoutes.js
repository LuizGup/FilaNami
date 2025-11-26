const express = require("express");
const router = express.Router();

const { loginGuicheHandler } = require("../controllers/guicheAuthController");

router.post("/login", loginGuicheHandler);

module.exports = router;
