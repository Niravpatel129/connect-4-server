const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('join', (room) => {
    socket.on('playerOneMoves', (moves) => {
      io.to(room).emit('playerOneMoves', moves);
    });

    socket.on('playerTwoMoves', (moves) => {
      io.to(room).emit('playerTwoMoves', moves);
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

    socket.join(room);
    io.to(room).emit('test', `hello ${room}`);
  });
});

server.listen(process.env.PORT || 4000, () => {
  console.log('listening on *:4000');
});
