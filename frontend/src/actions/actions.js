import * as type from '../constants/actionTypes';

export const enterNewRoomSuccess = (data) => ({
  type: type.ENTER_NEW_ROOM_SUCCESS,
  ...data
});
export const enterNewRoomFailure = () => ({
  type: type.ENTER_NEW_ROOM_FAILURE
});

export const matchPartnerPending = () => ({
  type: type.MATCH_PARTNER_PENDING
});
export const matchPartnerSuccess = (data) => ({
  type: type.MATCH_PARTNER_SUCCESS,
  ...data
});
export const matchPartnerRestart = () => ({
  type: type.MATCH_PARTNER_RESTART,
});
export const matchPartnerFailure = () => ({
  type: type.MATCH_PARTNER_FAILURE
});

export const partnerDisconnectionSuccess = () => ({
  type: type.PARTNER_DISCONNECTION_SUCCESS
});
export const partnerDisconnectionCancel = () => ({
  type: type.PARTNER_DISCONNECTION_CANCEL
});
export const partnerDisconnectionFailure = () => ({
  type: type.PARTNER_DISCONNECTION_FAILURE
});
