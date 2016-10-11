import { createSelector } from 'reselect';
import { get, map, pick } from 'lodash';

/**
 * Direct selector to the app state domain
 */
const selectGlobal = () => state => state.global;

const selectAuthState = () => createSelector(
  selectGlobal(),
  (substate) => substate.loggedIn
);

const selectCurrentUser = () => createSelector(
  selectGlobal(),
  (substate) => substate.userData
);

const selectEvents = () => createSelector(
  selectGlobal(),
  (substate) => substate.pageEvents
);

const selectCurrentUserClientId = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'userData.roleForClient.client.id', null)
);

const selectCurrentUserStripeCustomerId = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'userData.roleForClient.client.stripeCustomerId', null)
);

// ///////////////////////////////////////////
// base data used across pages
// ///////////////////////////////////////////
const selectSites = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.sites', [])
);

// Deccorated site locations
const selectSiteLocations = () => createSelector(
  selectGlobal(),
  (substate) => {
    const sites = get(substate, 'baseData.sites', []);
    return map(sites, e => pick(e, ['id', 'name']));
  }
);

const selectIndications = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.indications', [])
);

const selectSources = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.sources', [])
);

const selectLevels = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.levels', [])
);

// Decorated study levels
const selectStudyLevels = () => createSelector(
  selectGlobal(),
  (substate) => {
    const levels = get(substate, 'baseData.levels', []);
    return map(levels, e => (
      {
        id: e.id,
        label: `${e.type}: $${e.price}`,
      }
    ));
  }
);

const selectCoupon = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.coupon', {})
);

const selectCards = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.cards', {})
);

const selectSavedCard = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.savedCard', {})
);

const selectDeletedCard = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.deletedCard', {})
);

const selectAddCredits = () => createSelector(
  selectGlobal(),
  (substate) => get(substate, 'baseData.addCredits', {})
);

const selectLocationState = () => state => state.routing.locationBeforeTransitions;

export {
  selectGlobal,
  selectAuthState,
  selectEvents,
  selectCurrentUser,
  selectCurrentUserClientId,
  selectCurrentUserStripeCustomerId,

  selectSites,
  selectSiteLocations,
  selectIndications,
  selectSources,
  selectLevels,
  selectStudyLevels,
  selectCoupon,
  selectCards,
  selectSavedCard,
  selectDeletedCard,
  selectAddCredits,

  selectLocationState,
};
