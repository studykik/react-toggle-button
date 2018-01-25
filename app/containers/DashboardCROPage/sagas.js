import { takeLatest } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { toastr } from 'react-redux-toastr';
import { get } from 'lodash';
import request from '../../utils/request';
import {
  FETCH_CRO,
  ADD_CRO,
  EDIT_CRO,
  DELETE_CRO,
} from './constants';

import {
  fetchCroSuccess,
  fetchCroError,
  addCroSuccess,
  addCroError,
  editCroSuccess,
  editCroError,
  deleteCroSuccess,
  deleteCroError,
} from './actions';

export function* dashboardCroSaga() {
  const watcherA = yield fork(fetchCroWatcher);
  const watcherB = yield fork(addCroWatcher);
  const watcherC = yield fork(editCroWatcher);
  const watcherD = yield fork(deleteCroWatcher);

  yield take(LOCATION_CHANGE);

  yield cancel(watcherA);
  yield cancel(watcherB);
  yield cancel(watcherC);
  yield cancel(watcherD);
}

export function* fetchCroWatcher() {
  yield* takeLatest(FETCH_CRO, fetchCroWorker);
}

export function* fetchCroWorker(action) {
  try {
    const query = action.query;
    const limit = action.limit || 50;
    const offset = action.offset || 0;

    let requestURL = `${API_URL}/cros/crosForDashboard?limit=${limit}&offset=${offset}`;

    if (query) {
      requestURL += `&query=${query}`;
    }

    const params = {
      method: 'GET',
    };
    const response = yield call(request, requestURL, params);
    let hasMoreItems = true;
    const page = (offset / 50) + 1;
    if (response.length < 50) {
      hasMoreItems = false;
    }
    yield put(fetchCroSuccess(response, hasMoreItems, page));
  } catch (err) {
    const errorMessage = get(err, 'message', 'Something went wrong while fetching cro');
    toastr.error('', errorMessage);
    yield put(fetchCroError(err));
  }
}

export function* addCroWatcher() {
  yield* takeLatest(ADD_CRO, addCroWorker);
}

export function* addCroWorker(action) {
  try {
    const requestURL = `${API_URL}/cros`;

    const params = {
      method: 'POST',
      body: JSON.stringify(action.payload),
    };
    const response = yield call(request, requestURL, params);

    yield put(addCroSuccess(response));
  } catch (err) {
    const errorMessage = get(err, 'message', 'Something went wrong while saving cro');
    toastr.error('', errorMessage);
    yield put(addCroError(err));
  }
}

export function* editCroWatcher() {
  yield* takeLatest(EDIT_CRO, editCroWorker);
}

export function* editCroWorker(action) {
  try {
    const requestURL = `${API_URL}/cros/${action.payload.id}`;

    const params = {
      method: 'PUT',
      body: JSON.stringify(action.payload),
    };
    const response = yield call(request, requestURL, params);

    yield put(editCroSuccess(response));
  } catch (err) {
    const errorMessage = get(err, 'message', 'Something went wrong while saving cro');
    toastr.error('', errorMessage);
    yield put(editCroError(err));
  }
}

export function* deleteCroWatcher() {
  yield* takeLatest(DELETE_CRO, deleteCroWorker);
}

export function* deleteCroWorker(action) {
  try {
    const requestURL = `${API_URL}/cros/${action.payload}`;

    const params = {
      method: 'DELETE',
    };
    yield call(request, requestURL, params);

    yield put(deleteCroSuccess({ id: action.payload }));
  } catch (err) {
    const errorMessage = get(err, 'message', 'Something went wrong while deleting cro');
    toastr.error('', errorMessage);
    yield put(deleteCroError(err));
  }
}

// All sagas to be loaded
export default [
  dashboardCroSaga,
];
