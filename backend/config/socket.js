const socketRoom = {};
const userList = {};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('client 접속 완료');
    console.log('접속자 아이디!!!!!!!!!!', socket.id);
    socket.emit('connected');

    socket.on('requestRandomChat', (userName) => {
      console.log('request random chat');
      console.log('Socket newName: ', userName);
      console.log('Socket id: ', socket.id);
      userList[socket.id] = userName;

      io.to(socket.id).emit('initialConnect', {
        connected: true,
        userName,
        userId: socket.id
      });

      const rooms = io.sockets.adapter.rooms;
      console.log(io.sockets.adapter);

      for (let key in rooms) {
        if (key !== socket.id && rooms[key].length === 1) {
          socket.join(key);
          socketRoom[socket.id] = {
            user1: {
              name: userName,
              id: socket.id
            },
            user2: {
              name: userList[key],
              id: key
            },
            chats: []
          };

          io.sockets.in(key).emit('completeMatch', {
            matched: true,
            users: socketRoom[socket.id]
          });
          console.log('rooms', rooms);
          console.log('socketRoom', socketRoom);
          return;
        }
      }
      console.log('COMPLETE!!!!');

      socket.join(socket.id);
      // socketRoom[socket.id] = {
      //   roomKey: socket.id,
      //   user: {
      //     name: userName,
      //     id: socket.id
      //   },
      //   partner: null,
      //   chats: []
      // };

      io.to(socket.id).emit('completeMatch', {
        matched: false
        // roomInfo: socketRoom[socket.id]
      });

      console.log('rooms', rooms);
      console.log('socketRoom', socketRoom);
    });

    socket.on('cancelRequest', (data) => {
      console.log('cancel request', data);
      const key = socketRoom[socket.id];
      socket.leave(key);
      io.sockets.in(key).emit('disconnect', {
        disconnect: 'ok'
      });
    });

    socket.on('disconnect', (data) => {
      console.log('disconnect', data);
      const key = socketRoom[socket.id];
      socket.leave(key);
      io.sockets.in(key).emit('disconnect', {
        disconnect: 'ok'
      });

      console.log(io.sockets.adapter.rooms);
    });




  });
};
