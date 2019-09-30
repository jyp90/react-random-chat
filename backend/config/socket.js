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
        connected: 'ok',
        userName
      });


      const rooms = io.sockets.adapter.rooms;

      for (let key in rooms) {
        if (rooms[key].length === 1) {
          socket.join(key);
          socketRoom[socket.id] = {
            roomKey: key,
            userName,
            partnerName: userList[socket.id]
          };

          io.sockets.in(key).emit('completeMatch', {
            match: 'ok',
            roomInfo: socketRoom[socket.id]
          });
          console.log('rooms', rooms);
          console.log('socketRoom', socketRoom);
          return;
        }
      }

      socket.join(socket.id);
      socketRoom[socket.id] = {
        socketId: socket.id,
        userName,
        partnerName: null
      };

      io.sockets.in(key).emit('completeMatch', {
        match: 'pending',
        roomInfo: socketRoom[socket.id]
      });

      console.log('rooms', rooms);
      console.log('socketRoom', socketRoom);
    });

    socket.on('cancelRequest', (data) => {
      console.log('cancel request');
      const key = socketRoom[socket.id];
      socket.leave(key);
    });

    socket.on('disconnect', (data) => {
      console.log('disconnect');
      const key = socketRoom[socket.id];
      socket.leave(key);
      io.sockets.in(key).emit('disconnect', {
        disconnect: 'ok'
      });

      console.log(io.sockets.adapter);
    });




  });
};
