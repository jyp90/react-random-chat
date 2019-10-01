import * as type from '../constants/actionTypes';

const connectionState = {
  isConnected: false,
  info: null,
  isError: false
};

const roomConnection = (state = connectionState, action) => {
  switch (action.type) {
    case (type.ENTER_NEW_ROOM_SUCCESS):
      return {
        ...state,
        isConnected: true,
        info: {
          id: action.userId,
          name: action.totalUserList[action.userId]
        }
      };
    case (type.ENTER_NEW_ROOM_FAILURE):
      return {
        ...state,
        isError: true
      };
    default:
      return state;
  }
}

export default roomConnection;
