const totalRoomList = {};
const totalUserList = {};
const waitingQueue = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('requestRandomChat', (userName) => {
      totalUserList[socket.id] = userName;

      io.to(socket.id).emit('initialConnect', {
        connected: true,
        totalUserList,
        userId: socket.id
      });

      if (waitingQueue.length > 0) {
        if (waitingQueue[0].id !== socket.id) {
          const partner = waitingQueue.shift();
          const roomKey = socket.id + partner.id;
          socket.join(roomKey);
          partner.join(roomKey);

          totalRoomList[socket.id] = roomKey;
          totalRoomList[partner.id] = roomKey;

          io.to(socket.id).emit('completeMatch', {
            matched: true,
            roomKey,
            partner: {
              id: partner.id,
              name: totalUserList[partner.id]
            }
          });
          io.to(partner.id).emit('completeMatch', {
            matched: true,
            roomKey,
            partner: {
              id: socket.id,
              name: totalUserList[socket.id]
            }
          });
        }
      } else {
        waitingQueue.push(socket);

        io.to(socket.id).emit('completeMatch', {
          matched: false
        });
      }
    });

    socket.on('sendTextMessage', (text, socketId) => {
      const roomKey = totalRoomList[socket.id];
      const newChat = {
        id: socketId,
        text
      };

      io.sockets.in(roomKey).emit('sendTextMessage', {
        chat: newChat
      });
    });

    socket.on('startTyping', () => {
      const roomKey = totalRoomList[socket.id];

      socket.broadcast.to(roomKey).emit('startTyping');
    });

    socket.on('stopTyping', () => {
      const roomKey = totalRoomList[socket.id];

      socket.broadcast.to(roomKey).emit('stopTyping');
    });

    socket.on('requestDisconnection', () => {
      const roomKey = totalRoomList[socket.id];
      socket.leave(roomKey);

      delete totalRoomList[socket.id];

      socket.broadcast.to(roomKey).emit('partnerDisconnection');
    });

    socket.on('leaveRoom', () => {
      const roomKey = totalRoomList[socket.id];
      socket.leave(roomKey);
    });

    socket.on('disconnect', () => {
      if (waitingQueue[0] && waitingQueue[0].id === socket.id) {
        waitingQueue.shift();
      }
      const roomKey = totalRoomList[socket.id];

      socket.broadcast.to(roomKey).emit('partnerDisconnection');
      delete totalRoomList[socket.id];
      delete totalUserList[socket.id];
    });

    socket.on('connect_error', (err) => {
      console.log('connect error', err);
      socket.emit('connect_error', err);
    });

    socket.on('error', (err) => {
      console.log('error', err);
      socket.emit('error', err);
    });
  });
};
