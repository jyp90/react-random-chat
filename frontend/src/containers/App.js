import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import App from '../components/App';
import * as action from '../actions/actions';

const SERVER_URL = 'http://localhost:8080';
const socket = socketIOClient(SERVER_URL);

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => ({
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
  },
  subscribeSocketEmit: () => {
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
      dispatch(action.connectChatFailure());
    });

    socket.on('error', (err) => {
      dispatch(action.connectChatFailure());
    });
  },
  subscribeTextMessage: () => {
    socket.once('sendTextMessage', ({ chat }) => {
      return dispatch(action.sendNewTextSuccess(chat));
    });
  },
  unsubscribeTextMessage: () => {
    socket.removeListener('sendTextMessage');
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
