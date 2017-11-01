/* eslint-disable no-constant-condition, consistent-return */

import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { reset } from 'redux-form';
import { toastr } from 'react-redux-toastr';
import { get } from 'lodash';

import request from '../../utils/request';
import {
  FETCH_FILTERED_PROTOCOLS,
  EXPORT_PATIENTS,
  ADD_PROTOCOL,
} from './constants';

import {
  filteredProtcolsFetched,
  filteredProtcolsFetchingError,
  patientsExported,
  exportPatientsError,
  // emptyRowRequiredError,
  addProtocolSucceess,
  addProtocolError,
} from './actions';

export function* patientDatabasePageSaga() {
  const watcherA = yield fork(fetchFilteredProtocolsWatcher);
  const watcherB = yield fork(exportPatientsWatcher);
  const watcherC = yield fork(addProtocolWatcher);

  yield take(LOCATION_CHANGE);

  yield cancel(watcherA);
  yield cancel(watcherB);
  yield cancel(watcherC);
}

// Bootstrap sagas
export default [
  patientDatabasePageSaga,
];

export function* exportPatientsWatcher() {
  while (true) {
    const { data } = yield take(EXPORT_PATIENTS);

    try {
      // check if we need to update the patient with study info
      const requestURL = `${API_URL}/patients/exportPatients`;
      const options = {
        method: 'POST',
        body: JSON.stringify({
          ...data,
        }),
      };
      const response = yield call(request, requestURL, options);

      toastr.success('Export Patients', 'Success! You have uploaded your patients.');
      yield put(patientsExported(response));
      // yield put(emptyRowRequiredError(false));
    } catch (err) {
      const errorMessage = get(err, 'message', 'Something went wrong while submitting your request');
      toastr.error('', errorMessage);
      yield put(exportPatientsError(err));
      if (err.status === 401) {
        yield call(() => { location.href = '/login'; });
      }
    }
  }
}

export function* addProtocolWatcher() {
  while (true) {
    const { payload } = yield take(ADD_PROTOCOL);
    console.log('addProtocolWatcher', payload);
    try {
      const requestURL = `${API_URL}/studies/addProtocol`;
      const params = {
        method: 'POST',
        body: JSON.stringify(payload),
      };
      const response = yield call(request, requestURL, params);

      toastr.success('Add Protocol', 'The request has been submitted successfully');
      yield put(addProtocolSucceess(response));

      yield put(reset('addProtocol'));
    } catch (err) {
      const errorMessage = get(err, 'message', 'Something went wrong while submitting your request');
      toastr.error('', errorMessage);
      yield put(addProtocolError(err));
      // if returns forbidden we remove the token from local storage
      if (err.status === 401) {
        yield call(() => { location.href = '/login'; });
      }
    }
  }
}

export function* fetchFilteredProtocolsWatcher() {
  while (true) {
    const { clientRoleId, siteId } = yield take(FETCH_FILTERED_PROTOCOLS);

    try {
      const params = {
        clientRoleId,
      };
      const requestURL = `${API_URL}/sites/${siteId}/protocols`;
      const response = yield call(request, requestURL, params);
      yield put(filteredProtcolsFetched(response));
    } catch (err) {
      yield put(filteredProtcolsFetchingError(err));
      console.error(err);
    }
  }
}
