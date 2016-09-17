import { createSelector } from 'reselect';
import { get } from 'lodash';

/**
 * Direct selector to the routing state domain
 */
const selectFormDomain = () => state => state.form;

/**
 * RequestProposalForm -> all values
 */
const selectRequestProposalForm = () => createSelector(
  selectFormDomain(),
  (substate) => get(substate, 'requestProposal.values', {})
);

const selectRequestProposalFormError = () => createSelector(
  selectFormDomain(),
  (substate) => {
    const errors = get(substate, 'requestProposal.syncErrors', {});
    return Object.keys(errors).length > 0;
  }
);

/**
 * RequestProposalForm -> `callTracking`
 */
const selectCallTracking = () => createSelector(
  selectFormDomain(),
  (substate) => get(substate, 'requestProposal.values.callTracking')
);

/**
 * RequestProposalForm -> count of `leads`
 */
const selectLeadsCount = () => createSelector(
  selectFormDomain(),
  (substate) => {
    const leads = get(substate, 'requestProposal.values.leads', []);
    return leads.length;
  }
);

export default selectFormDomain;
export {
  selectRequestProposalForm,
  selectRequestProposalFormError,
  selectCallTracking,
  selectLeadsCount,
};
