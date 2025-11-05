const express = require('express');
const cors = require('cors');

const app = express();

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());


// Habilita CORS para o frontend
// Removi as chamadas duplicadas e deixei apenas uma configuração.
app.use(cors({
    origin: 'http://localhost:5173', // Permite requisições do frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
}));

// --- Rotas ---
const userRoutes = require('./routes/userRoute');
const senhaRoutes = require('./routes/senhaRoute');
const guicheRoutes = require('./routes/guicheRoute');

app.use('/api/users', userRoutes);
app.use('/api/senhas', senhaRoutes);
app.use('/api/guiches', guicheRoutes); // Define o endpoint base para as rotas do guichê

// apenas teste
app.get('/', (req, res) => {
    res.send('Rodando a API da Fila NAMI!');
});

module.exports = app;