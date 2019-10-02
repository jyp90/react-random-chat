import * as type from '../constants/actionTypes';

const matchState = {
  isMatched: false,
  partner: null,
  key: null,
  isError: false
};

const roomMatch = (state = matchState, action) => {
  switch (action.type) {
    case (type.MATCH_PARTNER_PENDING):
      return {
        ...state,
        isMatched: false
      };
    case (type.MATCH_PARTNER_SUCCESS):
      return {
        ...state,
        isMatched: true,
        partner: action.partner,
        key: action.roomKey
      };
    case (type.MATCH_PARTNER_RESTART):
      return {
        ...state,
        isMatched: false,
        partner: null,
        key: null,
        isError: false
      };
    case (type.MATCH_PARTNER_FAILURE):
      return {
        ...state,
        isError: true
      };
    default:
      return state;
  }
}

export default roomMatch;
