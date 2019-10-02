import { connect } from 'react-redux';
import socketIOClient from 'socket.io-client';
import App from '../components/App';
import * as action from '../actions/actions';

const SERVER_URL = 'http://localhost:8080';
const socket = socketIOClient(SERVER_URL);

const mapStateToProps = state => {
  console.log('STATE-------',state);
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
    dispatch(action.partnerDisconnectionPending());
    dispatch(action.matchPartnerRestart());
  },
  handleNextChatting: (name) => {
    socket.emit('requestDisconnection');
    dispatch(action.clearChatTexts());
    dispatch(action.partnerDisconnectionPending());
    dispatch(action.matchPartnerRestart());
    socket.emit('requestRandomChat', name);
  },
  handleTextSending: (text, roomKey, socketId, partnerId) => {
    if (!text.trim()) {
      return;
    }
    socket.emit('sendTextMessage', text, roomKey, socketId);
  },
  subscribeSocketEmit: () => {
    socket.on('initialConnect', (data) => {
      console.log('INITIAL CONNECT', data);
      dispatch(action.enterNewRoomSuccess(data));
    });
    socket.on('completeMatch', (roomData) => {
      console.log(roomData);

      if (!roomData.matched) {
        dispatch(action.matchPartnerPending());
      } else {
        dispatch(action.matchPartnerSuccess(roomData));
      }
    });

    socket.on('partnerDisconnection', () => {
      socket.emit('leaveRoom');
      dispatch(action.clearChatTexts());
      dispatch(action.partnerDisconnectionSuccess());
    });
  },
  subscribeTextMessage: () => {
    socket.once('sendTextMessage', ({ chat }) => {
      console.log('Trigger!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
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
