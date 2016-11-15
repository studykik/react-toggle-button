
// /* eslint-disable no-constant-condition, consistent-return */

import { takeLatest } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { actions as toastrActions } from 'react-redux-toastr';
import { reset } from 'redux-form';
import { get } from 'lodash';
import moment from 'moment';
import request from 'utils/request';

import {
  formSubmitted,
  formSubmissionError,
  sitesFetched,
  sitesFetchingError,
} from 'containers/RewardsPage/actions';

import {
  SUBMIT_FORM,
  FETCH_SITES,
} from 'containers/RewardsPage/constants';

// Bootstrap sagas
export default [
  RewardsPageSaga,
];

// Does not allow concurrent fetches of site locations (for demo purpose)
// Alternatively you may use takeEvery
export function* fetchSitesWatcher() {
  yield* takeLatest(FETCH_SITES, fetchSites);
}

export function* fetchSites() {
  try {
    const requestURL = `${API_URL}/sites`;
    const response = yield call(request, requestURL);
    yield put(sitesFetched(response));
  } catch (err) {
    yield put(sitesFetchingError(err));
  }
}

export function* submitFormWatcher() {
  while (true) {
    // listen for the SUBMIT_FORM action dispatched on form submit
    const { payload } = yield take(SUBMIT_FORM);
    console.log('dxxxxxxxx');
    console.log(payload);

    const reLoad = {
      rewardData: 'string',
      points: payload.points,
      created: moment(),
      entity_id: 4,
      client_id: 4,
    };

    try {
      const requestURL = `${API_URL}/rewards`;
      const params = {
        method: 'POST',
        body: JSON.stringify(reLoad),
      };
      const response = yield call(request, requestURL, params);

      yield put(toastrActions.success('Rewards', 'The request has been submitted successfully'));
      yield put(formSubmitted(response));

      // Clear the form values
      yield put(reset('rewards'));
    } catch (err) {
      const errorMessage = get(err, 'message', 'Something went wrong while submitting your request');
      yield put(toastrActions.error('', errorMessage));
      yield put(formSubmissionError(err));
    }
  }
}

export function* RewardsPageSaga() {
  const watcherA = yield fork(fetchSitesWatcher);
  const watcherB = yield fork(submitFormWatcher);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcherA);
  yield cancel(watcherB);
}
