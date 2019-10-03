import * as type from '../constants/actionTypes';

const textSendState = {
  isTyping: false,
  chats: []
};

const textSending = (state = textSendState, action) => {
  switch (action.type) {
    case (type.SEND_NEW_TEXT_SUCCESS):
      const newChats = state.chats.slice();
      newChats.push(action.chat);

      return {
        ...state,
        chats: newChats
      };
    case (type.CLEAR_CHAT_TEXTS):
      return {
        ...state,
        chats: []
      };
    case (type.START_TYPING):
      return {
        ...state,
        isTyping: true
      };
    case (type.STOP_TYPING):
      return {
        ...state,
        isTyping: false
      };
    default:
      return state;
  }
}

export default textSending;
