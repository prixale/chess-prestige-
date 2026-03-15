const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // URL por defecto de Vite
    methods: ["GET", "POST"]
  }
});

let waitingPlayer = null;
let rooms = {};

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Matchmaking simple
  if (waitingPlayer) {
    // Si hay alguien esperando, emparejar
    const roomId = `room_${waitingPlayer.id}_${socket.id}`;
    
    // Unir ambos al room
    waitingPlayer.join(roomId);
    socket.join(roomId);
    
    rooms[roomId] = {
      players: {
        w: waitingPlayer.id,
        b: socket.id
      },
      boardState: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' // FEN inicial
    };

    // Notificar a los jugadores de su color y room
    io.to(waitingPlayer.id).emit('gameStart', { color: 'w', roomId });
    io.to(socket.id).emit('gameStart', { color: 'b', roomId });

    console.log(`Partida creada: ${roomId}`);
    waitingPlayer = null;
  } else {
    // Si no hay nadie, este jugador espera
    waitingPlayer = socket;
    socket.emit('waiting', { message: 'Esperando oponente...' });
    console.log('Jugador esperando:', socket.id);
  }

  // Manejar el movimiento de una pieza
  socket.on('move', ({ roomId, move, fen }) => {
    // Retransmitir el movimiento al otro jugador en la sala
    socket.to(roomId).emit('opponentMove', { move, fen });
    if(rooms[roomId]) rooms[roomId].boardState = fen;
  });

  // Manejar mensajes de chat
  socket.on('sendMessage', (messageData) => {
    socket.to(messageData.roomId).emit('receiveMessage', messageData);
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }
    // Buscar si estaba en alguna sala y notificar al oponente
    for (const roomId in rooms) {
      const room = rooms[roomId];
      if (room.players.w === socket.id || room.players.b === socket.id) {
        socket.to(roomId).emit('opponentDisconnected');
        delete rooms[roomId]; // Limpiar la sala
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor de WebSocket corriendo en puerto ${PORT}`);
});
