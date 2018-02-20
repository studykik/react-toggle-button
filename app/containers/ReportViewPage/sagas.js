import React from 'react';
import { takeLatest } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { actions as toastrActions, toastr } from 'react-redux-toastr';
import FaSpinner from 'react-icons/lib/fa/spinner';
import { get } from 'lodash';
import { getItem, removeItem } from '../../utils/localStorage';
import request from '../../utils/request';
import composeQueryString from '../../utils/composeQueryString';

import {
  FETCH_PATIENT_SIGN_UPS,
  GET_REPORTS_LIST,
  CHANGE_PROTOCOL_STATUS,
  EXPORT_STUDIES,
  GET_REPORTS_TOTALS,
  GET_CATEGORY_NOTES,
} from './constants';

import {
  getReportsListSuccess,
  getReportsListError,
  changeProtocolStatusSuccess,
  changeProtocolStatusError,
  getReportsTotalsSuccess,
  getReportsTotalsError,
  getCategoryNotesSuccess,
  getCategoryNotesError,
  fetchPatientSignUpsSucceeded,
} from './actions';


export function* reportViewPageSaga() {
  const watcherA = yield fork(fetchReportsWatcher);
  const watcherB = yield fork(changeProtocolStatusWatcher);
  const watcherC = yield fork(exportStudiesWatcher);
  const watcherD = yield fork(fetchReportsTotalsWatcher);
  const watcherE = yield fork(getCategoryNotesWatcher);
  const watcherF = yield fork(fetchPatientSignUpsWatcher);

  yield take(LOCATION_CHANGE);

  yield cancel(watcherA);
  yield cancel(watcherB);
  yield cancel(watcherC);
  yield cancel(watcherD);
  yield cancel(watcherE);
  yield cancel(watcherF);
}

export function* fetchPatientSignUpsWatcher() {
  yield* takeLatest(FETCH_PATIENT_SIGN_UPS, fetchPatientSignUpsWorker);
}

export function* fetchPatientSignUpsWorker(action) {
  try {
    let requestURL = '';
    let timezone = action.currentUser.timezone;
    const protocolNumber = action.protocolNumber;
    if (action.currentUser.roleForClient && action.currentUser.roleForClient.client_id) {
      requestURL = `${API_URL}/clients/${action.currentUser.roleForClient.client_id}/patientSignUps`;
      if (!action.currentUser.roleForClient.isAdmin) {
        timezone = action.currentUser.roleForClient.site.timezone;
      }
    } else {
      requestURL = `${API_URL}/sponsorRoles/${action.currentUser.roleForSponsor.id}/patientSignUps`;
    }

    const params = {
      method: 'GET',
      query: {
        timezone,
        protocolNumber,
      },
    };
    const response = yield call(request, requestURL, params);

    yield put(fetchPatientSignUpsSucceeded(response));
  } catch (err) {
    const errorMessage = get(err, 'message', 'Something went wrong while fetching patients for selected study');
    toastr.error('', errorMessage);
    if (err.status === 401) {
      yield call(() => { location.href = '/login'; });
    }
  }
}

export function* fetchReportsWatcher() {
  yield* takeLatest(GET_REPORTS_LIST, fetchReportsWorker);
}

export function* fetchReportsWorker(action) {
  try {
    const params = action.searchParams;

    const limit = action.limit || 50;
    const offset = action.offset || 0;
    const sort = action.sort || null;
    const order = action.order || null;

    params.limit = limit;
    params.offset = offset;
    if (sort && order) {
      params.orderBy = sort;
      params.orderDir = ((order === 'down') ? 'DESC' : 'ASC');
    }

    const queryString = composeQueryString(params);

    const requestURL = `${API_URL}/studies/getStudiesByProtocol?${queryString}`;


    const response = yield call(request, requestURL);

    let hasMore = true;
    const page = (offset / 10) + 1;
    if (response.length < 10) {
      hasMore = false;
    }

    yield put(getReportsListSuccess(response, hasMore, page));
  } catch (err) {
    yield put(getReportsListError(err));
  }
}

export function* changeProtocolStatusWatcher() {
  yield* takeLatest(CHANGE_PROTOCOL_STATUS, changeProtocolStatusWorker);
}

export function* changeProtocolStatusWorker(action) {
  try {
    const requestURL = `${API_URL}/studies/${action.payload.studyId}/changeProtocolStatus`;
    const options = {
      method: 'GET',
      query: {
        status: action.status,
      },
    };

    const response = yield call(request, requestURL, options);
    yield put(changeProtocolStatusSuccess(response));
    toastr.success('Success!', `The study is now ${action.payload.status ? 'active' : 'inactive'}.`);
  } catch (err) {
    yield put(changeProtocolStatusError(err));
    const errorMessage = get(err, 'message', 'Something went wrong while updating study status');
    toastr.error('', errorMessage);
  }
}

export function* exportStudiesWatcher() {
  yield* takeLatest(EXPORT_STUDIES, exportStudiesWorker);
}

export function* exportStudiesWorker(action) {
  const authToken = getItem('auth_token');
  if (!authToken) {
    return;
  }

  try {
    const queryString = composeQueryString({ ...action.payload });
    const requestURL = `${API_URL}/studies/getStudiesForDB?${queryString}`;
    yield call(request, requestURL);
    const toastrOptions = {
      id: 'loadingToasterForExportStudies',
      type: 'success',
      message: 'Loading...',
      options: {
        timeOut: 0,
        icon: (<FaSpinner size={40} className="spinner-icon text-info" />),
        showCloseButton: true,
      },
    };
    yield put(toastrActions.add(toastrOptions));
  } catch (e) {
    // if returns forbidden we remove the token from local storage
    if (e.status === 401) {
      removeItem('auth_token');
    }
    const errorMessage = get(e, 'message', 'Something went wrong while exporting studies. Please try again later.');
    toastr.error('', errorMessage);
    if (e.status === 401) {
      yield call(() => { location.href = '/login'; });
    }
  }
}

export function* fetchReportsTotalsWatcher() {
  yield* takeLatest(GET_REPORTS_TOTALS, fetchReportsTotalsWorker);
}

export function* fetchReportsTotalsWorker(action) {
  try {
    let queryString;
    let requestURL;
    if (action.searchParams) {
      queryString = composeQueryString(action.searchParams);
      requestURL = `${API_URL}/studies/getStudiesByProtocolTotals?${queryString}`;
    } else {
      requestURL = `${API_URL}/studies/getStudiesByProtocolTotals`;
    }
    const response = yield call(request, requestURL);
    yield put(getReportsTotalsSuccess(response));
  } catch (err) {
    yield put(getReportsTotalsError(err));
  }
}

export function* getCategoryNotesWatcher() {
  yield* takeLatest(GET_CATEGORY_NOTES, getCategoryNotesWorker);
}

export function* getCategoryNotesWorker(action) {
  try {
    const params = action.searchParams || {};

    const limit = action.limit || 10;
    const offset = action.offset || 0;

    params.category = action.category;
    params.studyId = action.studyId;
    params.limit = limit;
    params.offset = offset;

    const queryString = composeQueryString(params);
    const requestURL = `${API_URL}/studies/getPatientNotesByCategory?${queryString}`;


    const response = yield call(request, requestURL);

    let hasMore = true;
    const page = (offset / 10) + 1;
    if (response.length < 10) {
      hasMore = false;
    }

    yield put(getCategoryNotesSuccess(response, hasMore, page));
  } catch (err) {
    yield put(getCategoryNotesError(err));
  }
}

// All sagas to be loaded
export default [
  reportViewPageSaga,
];
