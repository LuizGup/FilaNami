const express = require('express');
const cors = require('cors');

const app = express();

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());


// habilita CORS para o frontend em http://localhost:5173
app.use(cors({
    origin: "http://localhost:5173"
}));

// se quiser liberar para qualquer origem durante o desenvolvimento, use:
// app.use(cors());

app.use(cors({
  origin: 'http://localhost:5173', // Permite requisições do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
}));

// apenas teste
app.get('/', (req, res) => {
    res.send('Rodando a API da Fila NAMI!');
});

module.exports = app;
