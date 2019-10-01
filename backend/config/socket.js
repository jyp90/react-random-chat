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
            members: [socket.id, partner.id]
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

          console.log('rooms--------');
          console.log('COMPLETE!!!!');
        }
      } else {
        waitingQueue.push(socket);

        io.to(socket.id).emit('completeMatch', {
          matched: false
        });
      }
    });

    socket.on('requestDisconnection', (data) => {
      console.log('disconnect', data);
      const roomKey = Object.keys(totalChatList).find(key => key.indexOf(socket.id) > -1);

      console.log('PARTNER===============', roomKey);
      if (roomKey) {
        socket.broadcast.to(roomKey).emit('partnerDisconnection', {
          disconnected: true
        });
        console.log('PARTNER===============', roomKey);
        socket.leave(roomKey);
        delete totalChatList[roomKey];
      }
      delete totalUserList[socket.id];

      console.log('sockets adapter rooms after disconnection==',io.sockets.adapter.rooms);
    });

    socket.on('disconnect', (data) => {
      console.log('disconnect', data);
      const roomKey = Object.keys(totalChatList).find(key => key.indexOf(socket.id) > -1);

      console.log('PARTNER===============', roomKey);
      socket.broadcast.to(roomKey).emit('partnerDisconnection', {
        disconnected: true
      });
      console.log('PARTNER===============', roomKey);
      delete totalChatList[roomKey];
      delete totalUserList[socket.id];

      console.log('sockets adapter rooms after disconnection==',io.sockets.adapter.rooms);
    });


  });
};
