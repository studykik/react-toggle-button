import { takeLatest } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { toastr } from 'react-redux-toastr';
import { get } from 'lodash';
import request from '../../utils/request';
import {
  FETCH_PROTOCOL,
  ADD_PROTOCOL,
  EDIT_PROTOCOL,
  DELETE_PROTOCOL,
} from './constants';

import {
  fetchProtocolSuccess,
  fetchProtocolError,
  addProtocolSuccess,
  addProtocolError,
  editProtocolSuccess,
  editProtocolError,
  deleteProtocolSuccess,
  deleteProtocolError,
} from './actions';

export function* dashboardProtocolSaga() {
  const watcherA = yield fork(fetchProtocolWatcher);
  const watcherB = yield fork(addProtocolWatcher);
  const watcherC = yield fork(editProtocolWatcher);
  const watcherD = yield fork(deleteProtocolWatcher);

  yield take(LOCATION_CHANGE);

  yield cancel(watcherA);
  yield cancel(watcherB);
  yield cancel(watcherC);
  yield cancel(watcherD);
}

export function* fetchProtocolWatcher() {
  yield* takeLatest(FETCH_PROTOCOL, fetchProtocolWorker);
}

export function* fetchProtocolWorker(action) {
  try {
    const query = action.query;
    const limit = action.limit || 50;
    const offset = action.offset || 0;
    let requestURL = `${API_URL}/protocols/protocolsForDashboard?limit=${limit}&offset=${offset}`;

    if (query) {
      requestURL += `&query=${query}`;
    }

    const params = {
      method: 'GET',
    };
    const response = yield call(request, requestURL, params);
    let hasMore = true;
    const page = (offset / 50) + 1;
    if (response.length < 50) {
      hasMore = false;
    }
    yield put(fetchProtocolSuccess(response, hasMore, page));
  } catch (err) {
    const errorMessage = get(err, 'message', 'Something went wrong while fetching protocols');
    toastr.error('', errorMessage);
    yield put(fetchProtocolError(err));
  }
}

export function* addProtocolWatcher() {
  yield* takeLatest(ADD_PROTOCOL, addProtocolWorker);
}

export function* addProtocolWorker(action) {
  try {
    const requestURL = `${API_URL}/protocols`;

    const params = {
      method: 'POST',
      body: JSON.stringify(action.payload),
    };
    const response = yield call(request, requestURL, params);

    yield put(addProtocolSuccess(response));
  } catch (err) {
    const errorMessage = get(err, 'message', 'Something went wrong while saving protocols');
    toastr.error('', errorMessage);
    yield put(addProtocolError(err));
  }
}

export function* editProtocolWatcher() {
  yield* takeLatest(EDIT_PROTOCOL, editProtocolWorker);
}

export function* editProtocolWorker(action) {
  try {
    const requestURL = `${API_URL}/protocols/${action.payload.id}`;

    const params = {
      method: 'PUT',
      body: JSON.stringify(action.payload),
    };
    const response = yield call(request, requestURL, params);
    if (response) {
      yield put(editProtocolSuccess(action.payload));
    } else {
      yield put(editProtocolSuccess(response));
    }
  } catch (err) {
    const errorMessage = get(err, 'message', 'Something went wrong while saving protocols');
    toastr.error('', errorMessage);
    yield put(editProtocolError(err));
  }
}

export function* deleteProtocolWatcher() {
  yield* takeLatest(DELETE_PROTOCOL, deleteProtocolWorker);
}

export function* deleteProtocolWorker(action) {
  try {
    const requestURL = `${API_URL}/protocols/${action.payload}`;

    const params = {
      method: 'DELETE',
    };
    yield call(request, requestURL, params);

    yield put(deleteProtocolSuccess({ id: action.payload }));
  } catch (err) {
    const errorMessage = 'Error! Sponsor user is associated to this protocol.';
    toastr.error('', errorMessage);
    yield put(deleteProtocolError(err));
  }
}

// All sagas to be loaded
export default [
  dashboardProtocolSaga,
];
