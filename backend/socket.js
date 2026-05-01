const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

let io = null;
const connectedSockets = new Map();

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error('No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid socket token'));
    }
  });

  io.on('connection', (socket) => {
    connectedSockets.set(socket.id, socket.user.username);

    io.emit('onlineUsers', connectedSockets.size);

    console.log(
      `Socket connected for user ${socket.user.username}. Online users: ${connectedSockets.size}`
    );

    socket.on('disconnect', () => {
      connectedSockets.delete(socket.id);

      io.emit('onlineUsers', connectedSockets.size);

      console.log(
        `Socket disconnected for user ${socket.user.username}. Online users: ${connectedSockets.size}`
      );
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized yet');
  }
  return io;
}

module.exports = { initSocket, getIO };