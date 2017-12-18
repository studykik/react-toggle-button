/*
 *
 * ResetPasswordPage actions
 *
 */

import {
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  NEW_PASSWORD_RECEIVED,
  CLEAR_RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from './constants';

export function resetPasswordRequest(payload) {
  return {
    type: RESET_PASSWORD_REQUEST,
    payload,
  };
}

export function resetPasswordSuccess(payload) {
  return {
    type: RESET_PASSWORD_SUCCESS,
    payload,
  };
}

export function newPasswordReceived(payload) {
  return {
    type: NEW_PASSWORD_RECEIVED,
    payload,
  };
}

export function clearResetPasswordSuccess(payload) {
  return {
    type: CLEAR_RESET_PASSWORD_SUCCESS,
    payload,
  };
}

export function resetPasswordError(payload) {
  return {
    type: RESET_PASSWORD_ERROR,
    payload,
  };
}
