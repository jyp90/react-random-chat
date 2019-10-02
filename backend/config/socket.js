const totalChatList = {};
const totalUserList = {};
const waitingQueue = [];

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('client 접속 완료');
    console.log('접속자 아이디!!!!!!!!!!', socket.id);
    socket.emit('connected');

    socket.on('requestRandomChat', (userName) => {
      console.log('request random chat');
      console.log('Socket newName: ', userName);
      console.log('Socket id: ', socket.id);
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

          totalChatList[roomKey] = {
            members: [socket.id, partner.id],
            chats: []
          };

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

          console.log('COMPLETE!!!!');
        }
      } else {
        waitingQueue.push(socket);

        io.to(socket.id).emit('completeMatch', {
          matched: false
        });
      }
    });

    socket.on('sendTextMessage', (text, roomKey, socketId) => {
      console.log('sendTextMessage');
      const newChat = {
        id: socketId,
        text
      };

      if (totalChatList[roomKey]) {
        totalChatList[roomKey].chats.push(newChat);
      }

      io.sockets.in(roomKey).emit('sendTextMessage', {
        chat: newChat
      });
    });

    socket.on('requestDisconnection', () => {
      console.log('requestDisconnection');
      const roomKey = Object.keys(totalChatList).find(key => key.indexOf(socket.id) > -1);

      socket.leave(roomKey);
      delete totalChatList[roomKey];

      socket.broadcast.to(roomKey).emit('partnerDisconnection', roomKey);
    });

    socket.on('leaveRoom', () => {
      const roomKey = Object.keys(totalChatList).find(key => key.indexOf(socket.id) > -1);
      socket.leave(roomKey);
    });

    socket.on('disconnect', () => {
      console.log('disconnect');
      if (waitingQueue[0] && waitingQueue[0].id === socket.id) {
        waitingQueue.shift();
      }
      const roomKey = Object.keys(totalChatList).find(key => key.indexOf(socket.id) > -1);

      socket.broadcast.to(roomKey).emit('partnerDisconnection', roomKey);
      delete totalChatList[roomKey];
      delete totalUserList[socket.id];
    });
  });
};
