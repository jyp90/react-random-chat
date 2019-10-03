import * as type from '../constants/actionTypes';

const matchState = {
  isMatched: false,
  partner: null
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
      };
    case (type.MATCH_PARTNER_RESTART):
      return {
        ...state,
        isMatched: false,
        partner: null
      };
    default:
      return state;
  }
}

export default roomMatch;
