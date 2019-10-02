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

      // console.log('socket=========',socket);
      console.log(waitingQueue);

      if (waitingQueue.length > 0) {
        if (waitingQueue[0].id !== socket.id) {
          console.log('WAITING!!!!!!!!!!!!!!');
          const partner = waitingQueue.shift();
          const roomKey = socket.id + partner.id;
          socket.join(roomKey);
          partner.join(roomKey);

          // partner.leave(partner.id);
          // socket.leave(socket.id);

          // const totalRooms = io.sockets.adapter.rooms;
          totalChatList[roomKey] = {
            members: [socket.id, partner.id],
            chats: []
          };

          console.log('totalChatList!==',totalChatList);
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
      const newChat = {
        id: socketId,
        text
      };
      console.log('sendTextMessage', newChat);
      totalChatList[roomKey].chats.push(newChat);

      io.sockets.in(roomKey).emit('sendTextMessage', {
        chat: newChat
      });
    });

    socket.on('requestDisconnection', (data) => {
      console.log('requestDisconnection', data);
      const roomKey = Object.keys(totalChatList).find(key => key.indexOf(socket.id) > -1);

      console.log('roomKey===============', roomKey);
      if (roomKey) {
        socket.broadcast.to(roomKey).emit('partnerDisconnection', {
          disconnected: true
        });
        socket.leave(roomKey);
        delete totalChatList[roomKey];
      }
      delete totalUserList[socket.id];

      console.log('sockets adapter rooms after disconnection==',io.sockets.adapter.rooms);
    });

    socket.on('disconnect', (data) => {
      console.log('disconnect', data);
      if (waitingQueue[0] && waitingQueue[0].id === socket.id) {
        waitingQueue.shift();
      }
      const roomKey = Object.keys(totalChatList).find(key => key.indexOf(socket.id) > -1);

      console.log('roomKey===============', roomKey);
      socket.broadcast.to(roomKey).emit('partnerDisconnection', {
        disconnected: true
      });
      delete totalChatList[roomKey];
      delete totalUserList[socket.id];

      console.log('sockets adapter rooms after disconnection==',io.sockets.adapter.rooms);
    });


  });
};
