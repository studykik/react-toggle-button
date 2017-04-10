/*
 *
 * Receipts actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_RECEIPTS,
  RECEIPTS_RECEIVED,
  GET_PDF,
  SET_SEARCH_OPTIONS,
  SET_ACTIVE_SORT,
  SHOW_INVOICE_PDF,
  SORT_PROPOSALS_SUCCESS,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function receiptsReceived(payload, hasMore, page) {
  return {
    type: RECEIPTS_RECEIVED,
    payload,
    hasMore,
    page,
  };
}

export function getReceipts(clientRoleId, limit, offset, receipts, orderBy, orderDir, payload) {
  return {
    type: GET_RECEIPTS,
    clientRoleId,
    limit,
    offset,
    receipts,
    orderBy,
    orderDir,
    payload,
  };
}

export function getPDF(payload) {
  return {
    type: GET_PDF,
    payload,
  };
}

export function setSearchOptions(payload) {
  return {
    type: SET_SEARCH_OPTIONS,
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

export function showInvoicePdf(invoiceId) {
  return {
    type: SHOW_INVOICE_PDF,
    invoiceId,
  };
}

export function sortProposalsSuccess(payload) {
  return {
    type: SORT_PROPOSALS_SUCCESS,
    payload,
  };
}

