import Message from '../models/Message.js';

const roomUsers = new Map();
const roomCode = new Map();

const getRoomUsers = (roomId) => {
  if (!roomUsers.has(roomId)) {
    roomUsers.set(roomId, new Map());
  }
  return roomUsers.get(roomId);
};

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-room', ({ roomId, userId, userName }) => {
      const normalizedRoomId = roomId.toUpperCase();
      socket.join(normalizedRoomId);
      socket.roomId = normalizedRoomId;
      socket.userId = userId;
      socket.userName = userName;

      const users = getRoomUsers(normalizedRoomId);
      users.set(socket.id, { userId, userName, socketId: socket.id });

      const participants = Array.from(users.values());

      socket.to(normalizedRoomId).emit('user-joined', {
        userName,
        message: `${userName} joined the room`,
      });

      io.to(normalizedRoomId).emit('room-users', participants);

      const currentCode = roomCode.get(normalizedRoomId);
      if (currentCode) {
        socket.emit('code-sync', currentCode);
      }

      const messages = [];
      socket.emit('join-success', { roomId: normalizedRoomId, participants });
    });

    socket.on('code-change', ({ roomId, code }) => {
      const normalizedRoomId = roomId.toUpperCase();
      roomCode.set(normalizedRoomId, code);
      socket.to(normalizedRoomId).emit('code-update', code);
    });

    socket.on('language-change', ({ roomId, language }) => {
      const normalizedRoomId = roomId.toUpperCase();
      socket.to(normalizedRoomId).emit('language-update', language);
    });

    socket.on('typing-start', ({ roomId, userName }) => {
      socket.to(roomId.toUpperCase()).emit('user-typing', { userName, isTyping: true });
    });

    socket.on('typing-stop', ({ roomId, userName }) => {
      socket.to(roomId.toUpperCase()).emit('user-typing', { userName, isTyping: false });
    });

    socket.on('send-message', async ({ roomId, sender, message }) => {
      const normalizedRoomId = roomId.toUpperCase();

      try {
        const savedMessage = await Message.create({
          roomId: normalizedRoomId,
          sender,
          message,
        });

        io.to(normalizedRoomId).emit('receive-message', {
          _id: savedMessage._id,
          sender: savedMessage.sender,
          message: savedMessage.message,
          createdAt: savedMessage.createdAt,
        });
      } catch (error) {
        socket.emit('message-error', { message: 'Failed to send message' });
      }
    });

    socket.on('get-messages', async ({ roomId }) => {
      try {
        const messages = await Message.find({ roomId: roomId.toUpperCase() })
          .sort({ createdAt: 1 })
          .limit(100);
        socket.emit('messages-history', messages);
      } catch (error) {
        socket.emit('message-error', { message: 'Failed to load messages' });
      }
    });

    socket.on('leave-room', ({ roomId, userName }) => {
      handleLeave(socket, io, roomId, userName);
    });

    socket.on('disconnect', () => {
      if (socket.roomId && socket.userName) {
        handleLeave(socket, io, socket.roomId, socket.userName);
      }
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

const handleLeave = (socket, io, roomId, userName) => {
  const normalizedRoomId = roomId.toUpperCase();
  const users = getRoomUsers(normalizedRoomId);

  if (users.has(socket.id)) {
    users.delete(socket.id);
  }

  socket.leave(normalizedRoomId);

  socket.to(normalizedRoomId).emit('user-left', {
    userName,
    message: `${userName} left the room`,
  });

  const participants = Array.from(users.values());
  io.to(normalizedRoomId).emit('room-users', participants);

  if (users.size === 0) {
    roomUsers.delete(normalizedRoomId);
  }
};

export default socketHandler;
