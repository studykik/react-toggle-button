import { createSelector } from 'reselect';
import { get } from 'lodash';

const selectRewardForm = () => state => state.form.reward;

const selectSiteLocation = () => createSelector(
  selectRewardForm(),
  (substate) => get(substate, 'values.site', 0)
);

export default selectRewardForm;
export {
  selectSiteLocation,
};
