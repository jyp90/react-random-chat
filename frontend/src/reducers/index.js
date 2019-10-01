import { combineReducers } from 'redux';
import roomConnection from './roomConnection';
import roomDisconnection from './roomDisconnection';
import roomMatch from './roomMatch';

export default combineReducers({
  roomConnection,
  roomDisconnection,
  roomMatch
});
