import * as type from '../constants/actionTypes';

export const connectChatSuccess = (data) => ({
  type: type.CONNECT_CHAT_SUCCESS,
  ...data
});

export const connectChatFailure = () => ({
  type: type.CONNECT_CHAT_FAILURE
});

export const disconnectChatSuccess = () => ({
  type: type.DISCONNECT_CHAT_SUCCESS
});

export const reconnectChatSuccess = () => ({
  type: type.RECONNECT_CHAT_SUCCESS
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

export const sendNewTextSuccess = (chat) => ({
  type: type.SEND_NEW_TEXT_SUCCESS,
  chat
});

export const clearChatTexts = () => ({
  type: type.CLEAR_CHAT_TEXTS
});

export const startTyping = () => ({
  type: type.START_TYPING
});

export const stopTyping = () => ({
  type: type.STOP_TYPING
});
