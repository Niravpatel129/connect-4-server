const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
var cors = require('cors');

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://nirav-connect-4.herokuapp.com', '*'],
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('join', (room) => {
    socket.join(room);

    socket.on('playerOneMoves', (moves) => {
      socket.to(room).emit('playerOneMoves', moves);
    });

    socket.on('playerTwoMoves', (moves) => {
      socket.to(room).emit('playerTwoMoves', moves);
    });

    socket.on('turn', () => {
      socket.broadcast.to(room).emit('turn', true);
    });

    socket.on('reset', () => {
      io.to(room).emit('reset');
    });

    socket.on('winner', (winner) => {
      io.to(room).emit('winner', winner);
    });
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log('listening on *:4000');
});
