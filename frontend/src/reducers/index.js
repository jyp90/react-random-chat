import { combineReducers } from 'redux';
import roomConnection from './roomConnection';
import roomDisconnection from './roomDisconnection';
import roomMatch from './roomMatch';
import textSending from './textSending';

export default combineReducers({
  roomConnection,
  roomDisconnection,
  roomMatch,
  textSending
});
