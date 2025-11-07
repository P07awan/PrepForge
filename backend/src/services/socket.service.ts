import { Server, Socket } from 'socket.io';
import { logger } from '../utils/logger';

interface UserSocket extends Socket {
  userId?: string;
  roomId?: string;
}

export const initializeSocketHandlers = (io: Server) => {
  io.on('connection', (socket: UserSocket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join interview room
    socket.on('join-room', ({ roomId, userId }) => {
      socket.userId = userId;
      socket.roomId = roomId;
      socket.join(roomId);
      
      // Notify others in the room
      socket.to(roomId).emit('user-joined', { userId, socketId: socket.id });
      
      logger.info(`User ${userId} joined room ${roomId}`);
    });

    // WebRTC signaling
    socket.on('offer', ({ roomId: _roomId, offer, to }) => {
      socket.to(to).emit('offer', { offer, from: socket.id });
    });

    socket.on('answer', ({ roomId: _roomId, answer, to }) => {
      socket.to(to).emit('answer', { answer, from: socket.id });
    });

    socket.on('ice-candidate', ({ roomId: _roomId, candidate, to }) => {
      socket.to(to).emit('ice-candidate', { candidate, from: socket.id });
    });

    // Chat messages
    socket.on('chat-message', ({ roomId, message }) => {
      io.to(roomId).emit('chat-message', {
        userId: socket.userId,
        message,
        timestamp: new Date(),
      });
    });

    // Screen sharing
    socket.on('start-screen-share', ({ roomId }) => {
      socket.to(roomId).emit('screen-share-started', { userId: socket.userId });
    });

    socket.on('stop-screen-share', ({ roomId }) => {
      socket.to(roomId).emit('screen-share-stopped', { userId: socket.userId });
    });

    // Interview controls
    socket.on('interview-started', ({ roomId }) => {
      io.to(roomId).emit('interview-started', { timestamp: new Date() });
    });

    socket.on('interview-ended', ({ roomId }) => {
      io.to(roomId).emit('interview-ended', { timestamp: new Date() });
    });

    // Disconnect
    socket.on('leave-room', ({ roomId }) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user-left', { userId: socket.userId });
      logger.info(`User ${socket.userId} left room ${roomId}`);
    });

    socket.on('disconnect', () => {
      if (socket.roomId) {
        socket.to(socket.roomId).emit('user-left', { userId: socket.userId });
      }
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
