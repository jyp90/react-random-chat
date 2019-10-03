import * as type from '../constants/actionTypes';

const connectionState = {
  isConnected: false,
  isPartnerUnlinked: false,
  info: null,
  isError: false
};

const roomConnection = (state = connectionState, action) => {
  switch (action.type) {
    case (type.DISCONNECT_CHAT_SUCCESS):
      return {
        ...state,
        isPartnerUnlinked: true
      };
    case (type.CONNECT_CHAT_SUCCESS):
      return {
        ...state,
        isConnected: true,
        info: {
          id: action.userId,
          name: action.totalUserList[action.userId]
        }
      };
    case (type.RECONNECT_CHAT_SUCCESS):
      return {
        ...state,
        isPartnerUnlinked: false
      };
    case (type.CONNECT_CHAT_FAILURE):
      return {
        ...state,
        isError: true
      };
    default:
      return state;
  }
}

export default roomConnection;
