/*
 *
 * DashboardMessagingNumbersPage actions
 *
 */

import {
  FETCH_MESSAGING_NUMBERS,
  FETCH_MESSAGING_NUMBERS_SUCCESS,
  FETCH_MESSAGING_NUMBERS_ERROR,
  ADD_MESSAGING_NUMBER,
  ADD_MESSAGING_NUMBER_SUCCESS,
  ADD_MESSAGING_NUMBER_ERROR,
  EDIT_MESSAGING_NUMBER,
  EDIT_MESSAGING_NUMBER_SUCCESS,
  EDIT_MESSAGING_NUMBER_ERROR,
  ARCHIVE_MESSAGING_NUMBER,
  ARCHIVE_MESSAGING_NUMBER_SUCCESS,
  ARCHIVE_MESSAGING_NUMBER_ERROR,
  SET_ACTIVE_SORT,
} from './constants';

export function fetchMessagingNumbers() {
  return {
    type: FETCH_MESSAGING_NUMBERS,
  };
}

export function fetchMessagingNumbersSuccess(payload) {
  return {
    type: FETCH_MESSAGING_NUMBERS_SUCCESS,
    payload,
  };
}

export function fetchMessagingNumbersError(payload) {
  return {
    type: FETCH_MESSAGING_NUMBERS_ERROR,
    payload,
  };
}

export function addMessagingNumber(payload) {
  return {
    type: ADD_MESSAGING_NUMBER,
    payload,
  };
}

export function addMessagingNumberSuccess(payload) {
  return {
    type: ADD_MESSAGING_NUMBER_SUCCESS,
    payload,
  };
}

export function addMessagingNumberError(payload) {
  return {
    type: ADD_MESSAGING_NUMBER_ERROR,
    payload,
  };
}

export function editMessagingNumber(payload) {
  return {
    type: EDIT_MESSAGING_NUMBER,
    payload,
  };
}

export function editMessagingNumberSuccess(payload) {
  return {
    type: EDIT_MESSAGING_NUMBER_SUCCESS,
    payload,
  };
}

export function editMessagingNumberError(payload) {
  return {
    type: EDIT_MESSAGING_NUMBER_ERROR,
    payload,
  };
}

export function archiveMessagingNumber(payload) {
  return {
    type: ARCHIVE_MESSAGING_NUMBER,
    payload,
  };
}

export function archiveMessagingNumberSuccess(payload) {
  return {
    type: ARCHIVE_MESSAGING_NUMBER_SUCCESS,
    payload,
  };
}

export function archiveMessagingNumberError(payload) {
  return {
    type: ARCHIVE_MESSAGING_NUMBER_ERROR,
    payload,
  };
}

export function setActiveSort(sort, direction) {
  return {
    type: SET_ACTIVE_SORT,
    sort,
    direction,
  };
}