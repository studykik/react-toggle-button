import { createSelector } from 'reselect';

/**
 * Direct selector to the listNewStudyPage state domain
 */
const selectListNewStudyPageDomain = () => state => state.listNewStudyPage;

/**
 * Other specific selectors
 */


/**
 * Default selector used by ListNewStudyPage
 */

const selectListNewStudyPage = () => createSelector(
  selectListNewStudyPageDomain(),
  (substate) => substate
);

const selectFormSubmissionStatus = () => createSelector(
  selectListNewStudyPageDomain(),
  (substate) => substate.formSubmissionStatus
);

const selectShowSubmitFormModal = () => createSelector(
  selectListNewStudyPageDomain(),
  (substate) => substate.showSubmitFormModal
);

const selectIndicationLevelPrice = () => createSelector(
  selectListNewStudyPageDomain(),
  (substate) => substate.indicationLevelPrice
);

const selectAddNotificationProcess = () => createSelector(
  selectListNewStudyPageDomain(),
  (substate) => substate.addNotificationProcess
);

const selectListNewStudyClientAdmins = () => createSelector(
  selectListNewStudyPageDomain(),
  substate => substate.clientAdmins
);

export default selectListNewStudyPage;
export {
  selectListNewStudyPageDomain,
  selectFormSubmissionStatus,
  selectShowSubmitFormModal,
  selectIndicationLevelPrice,
  selectAddNotificationProcess,
  selectListNewStudyClientAdmins,
};
