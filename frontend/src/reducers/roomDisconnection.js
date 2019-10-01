import * as type from '../constants/actionTypes';

const disconnectionState = {
  isDisconnected: false,
  isError: false
};

const roomDisconnection = (state = disconnectionState, action) => {
  switch (action.type) {
    case (type.PARTNER_DISCONNECTION_SUCCESS):
      return {
        ...state,
        isDisconnected: true
      };
    case (type.PARTNER_DISCONNECTION_CANCEL):
      return {
        ...state,
        isDisconnected: false
      };
    case (type.PARTNER_DISCONNECTION_FAILURE):
      return {
        ...state,
        isError: true
      };
    default:
      return state;
  }
}

export default roomDisconnection;
