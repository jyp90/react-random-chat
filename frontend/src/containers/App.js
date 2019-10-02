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
      dispatch(action.clearChatTexts());
      dispatch(action.partnerDisconnectionSuccess());
    });
  },
  handleRoomConnection: (name) => {
    if (!name.trim()) {
      return;
    }

    socket.emit('requestRandomChat', name);
  },
  handleNextChatting: (name) => {
    socket.emit('requestDisconnection');
    socket.emit('requestRandomChat', name);
    dispatch(action.partnerDisconnectionCancel());
    dispatch(action.matchPartnerRestart());
  },
  handleTextSending: (text, roomKey, socketId, partnerId) => {
    socket.emit('sendTextMessage', text, roomKey, socketId);
  },
  handleTextReceiving: () => {
    socket.once('sendTextMessage', ({ chat }) => {
      console.log('Trigger!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      return dispatch(action.sendNewTextSuccess(chat));
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
