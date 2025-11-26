const { login, register } = require('../services/auth.service');

const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await login(email, password);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Credenciais inválidas') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to perform login" });
  }
};

const registerHandler = async (req, res) => {
  const { name, email, password, userType } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  try {
    const newUser = await register(name, email, password, userType);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.message === 'E-mail já cadastrado.') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to register user" });
  }
};

module.exports = {
  loginHandler,
  registerHandler,
};