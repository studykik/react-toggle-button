/*
 *
 * Proposals actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_PROPOSALS,
  PROPOSALS_RECEIVED,
  GET_PDF,
  CREATE_PDF,
  SHOW_PROPOSAL_PDF,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function proposalsReceived(payload, hasMore, page) {
  return {
    type: PROPOSALS_RECEIVED,
    payload,
    hasMore,
    page,
  };
}

export function getProposals(clientRoleId, limit, offset, proposals, searchParams) {
  return {
    type: GET_PROPOSALS,
    clientRoleId,
    limit,
    offset,
    proposals,
    searchParams,
  };
}

export function createPDF(payload) {
  return {
    type: CREATE_PDF,
    payload,
  };
}

export function getPDF(payload) {
  return {
    type: GET_PDF,
    payload,
  };
}

export function pdfCreated(payload) {
  return {
    type: GET_PDF,
    payload,
  };
}

export function showProposalPdf(proposalId) {
  return {
    type: SHOW_PROPOSAL_PDF,
    proposalId,
  };
}
