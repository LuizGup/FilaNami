const http = require('http');
const { Server } = require("socket.io");
const app = require('./app'); 

const portaServidor = process.env.PORTA_SERVIDOR || 3000;

const userRoutes = require('./routes/userRoute');
const senhaRoutes = require('./routes/senhaRoute');
const guicheRoutes = require('./routes/guicheRoute');
const setorRoutes = require('./routes/setorRoute');
const historicoRoutes = require('./routes/historicoRoute');

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

app.use('/api/users', userRoutes);
app.use('/api/senhas', senhaRoutes);
app.use('/api/guiches', guicheRoutes);
app.use('/api/setores', setorRoutes); 
app.use('/api/historico', historicoRoutes); 

app.get('/', (req, res) => {
  res.send('Rodando a API da Fila NAMI!');
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