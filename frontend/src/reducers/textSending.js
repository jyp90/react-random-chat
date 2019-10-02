import * as type from '../constants/actionTypes';

const textSendState = {
  chats: [],
  isError: false
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
    case (type.SEND_NEW_TEXT_FAILURE):
      return {
        ...state,
        isError: true
      };
    case (type.CLEAR_CHAT_TEXTS):
      return {
        ...state,
        chats: []
      };
    default:
      return state;
  }
}

export default textSending;
