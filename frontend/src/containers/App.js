import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import App from '../components/App';
import * as action from '../actions/actions';

const SERVER_URL = 'http://localhost:8080';
const socket = socketIOClient(SERVER_URL);

const subscribeSocket = (dispatch) => {
  socket.on('initialConnect', (data) => {
    dispatch(action.connectChatSuccess(data));
  });

  socket.on('completeMatch', (roomData) => {
    if (!roomData.matched) {
      dispatch(action.matchPartnerPending());
    } else {
      dispatch(action.matchPartnerSuccess(roomData));
    }
  });

  socket.on('partnerDisconnection', () => {
    socket.emit('leaveRoom');
    dispatch(action.clearChatTexts());
    dispatch(action.disconnectChatSuccess());
  });

  socket.on('startTyping', () => {
    dispatch(action.startTyping());
  });

  socket.on('stopTyping', () => {
    dispatch(action.stopTyping());
  });

  socket.on('connect_error', (err) => {
    dispatch(action.connectChatFailure(err));
  });

  socket.on('error', (err) => {
    dispatch(action.connectChatFailure(err));
  });

  socket.on('sendTextMessage', ({ chat }) => {
    dispatch(action.sendNewTextSuccess(chat));
  });

  socket.on('disconnect', () => {
    dispatch(action.connectChatFailure());
  });
};

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  subscribeSocket(dispatch);

  return {
    handleRoomConnection: (name) => {
      if (!name.trim()) {
        return;
      }
      socket.emit('requestRandomChat', name);
    },
    handleReconnection: (name) => {
      socket.emit('requestRandomChat', name);
      dispatch(action.clearChatTexts());
      dispatch(action.reconnectChatSuccess());
      dispatch(action.matchPartnerRestart());
    },
    handleNextChatting: (name) => {
      socket.emit('requestDisconnection');
      socket.emit('requestRandomChat', name);
      dispatch(action.clearChatTexts());
      dispatch(action.reconnectChatSuccess());
      dispatch(action.matchPartnerRestart());
    },
    handleTextSending: (text, socketId) => {
      if (!text.trim()) {
        return;
      }
      socket.emit('sendTextMessage', text, socketId);
    },
    handleTypingStart: () => {
      socket.emit('startTyping');
    },
    handleTypingStop: () => {
      socket.emit('stopTyping');
    }
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
