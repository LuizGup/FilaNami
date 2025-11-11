const http = require('http');
const app = require('./app');
const { Server } = require("socket.io");

const portaServidor = process.env.portaServidor || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

server.listen(portaServidor, () => {
  console.log(`Servidor rodando na porta ${portaServidor}`);
});