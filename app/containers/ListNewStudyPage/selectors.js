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

export default selectListNewStudyPage;
export {
  selectListNewStudyPageDomain,
};
