import { combineReducers } from 'redux';
import roomConnection from './roomConnection';
import roomMatch from './roomMatch';
import textSending from './textSending';

export default combineReducers({
  roomConnection,
  roomMatch,
  textSending
});
