/* eslint-disable comma-dangle */

import update from 'react-addons-update';

import {
  FETCH_PATIENTS_BY_STUDY,
  FETCH_PATIENTS_BY_STUDY_SUCCESS,
  FETCH_PATIENTS_BY_STUDY_ERROR,
  FETCH_SCHEDULES,
  FETCH_SCHEDULES_SUCCESS,
  FETCH_SCHEDULES_ERROR,
  FETCH_SPONSOR_SCHEDULES,
  FETCH_SPONSOR_SCHEDULES_SUCCESS,
  FETCH_SPONSOR_SCHEDULES_ERROR,
  FETCH_SPONSOR_PROTOCOLS,
  FETCH_SPONSOR_PROTOCOLS_SUCCESS,
  FETCH_SPONSOR_PROTOCOLS_ERROR,
  FETCH_SPONSOR_SITES,
  FETCH_SPONSOR_SITES_SUCCESS,
  FETCH_SPONSOR_SITES_ERROR,
  SUBMIT_SCHEDULE,
  SUBMIT_SCHEDULE_SUCCESS,
  SUBMIT_SCHEDULE_ERROR,
  DELETE_SCHEDULE,
  DELETE_SCHEDULE_SUCCESS,
  DELETE_SCHEDULE_ERROR,
  SET_ACTIVE_SORT,
} from './constants';

const initialState = {
  patientsByStudy: {
    isFetching: false,
    data: [],
    error: null,
  },
  schedules: {
    isFetching: false,
    isSubmitting: false,
    isDeleting: false,
    data: [],
    error: null,
  },
  sponsorSchedules: {
    isFetching: false,
    isSubmitting: false,
    isDeleting: false,
    data: [],
    error: null,
  },
  sponsorProtocols: {
    details: [],
    fetching: false,
    error: null,
  },
  sponsorSites: {
    details: [],
    fetching: false,
    error: null,
  },
  paginationOptions: {
    activeSort: null,
    activeDirection: null,
  },
};

export default function calendarPageReducer(state = initialState, action) {
  const { payload } = action;

  switch (action.type) {
    case FETCH_PATIENTS_BY_STUDY:
      return {
        ...state,
        patientsByStudy: {
          isFetching: true,
        }
      };
    case FETCH_PATIENTS_BY_STUDY_SUCCESS:
      return {
        ...state,
        patientsByStudy: {
          isFetching: false,
          data: payload,
          error: null,
        }
      };
    case FETCH_PATIENTS_BY_STUDY_ERROR:
      return {
        ...state,
        patientsByStudy: {
          isFetching: false,
          error: payload,
        }
      };
    case FETCH_SCHEDULES:
      return update(state, {
        schedules: {
          isFetching: { $set: true },
        }
      });
    case FETCH_SCHEDULES_SUCCESS:
      return update(state, {
        schedules: {
          isFetching: { $set: false },
          data: { $set: payload },
        }
      });
    case FETCH_SCHEDULES_ERROR:
      return update(state, {
        schedules: {
          isFetching: { $set: false },
          error: { $set: payload },
        }
      });
    case FETCH_SPONSOR_SCHEDULES:
      return update(state, {
        sponsorSchedules: {
          isFetching: { $set: true },
        }
      });
    case FETCH_SPONSOR_SCHEDULES_SUCCESS:
      return update(state, {
        sponsorSchedules: {
          isFetching: { $set: false },
          data: { $set: payload },
        }
      });
    case FETCH_SPONSOR_SCHEDULES_ERROR:
      return update(state, {
        sponsorSchedules: {
          isFetching: { $set: false },
          error: { $set: payload },
        }
      });
    case FETCH_SPONSOR_PROTOCOLS:
      return {
        ...state,
        sponsorProtocols: {
          details: state.sponsorProtocols.details,
          fetching: true,
          error: null,
        },
      };
    case FETCH_SPONSOR_PROTOCOLS_SUCCESS:
      return {
        ...state,
        sponsorProtocols: {
          details: action.payload,
          fetching: false,
          error: null,
        },
      };
    case FETCH_SPONSOR_PROTOCOLS_ERROR:
      return {
        ...state,
        sponsorProtocols: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
    case FETCH_SPONSOR_SITES:
      return {
        ...state,
        sponsorSites: {
          details: state.sponsorSites.details,
          fetching: true,
          error: null,
        },
      };
    case FETCH_SPONSOR_SITES_SUCCESS:
      return {
        ...state,
        sponsorSites: {
          details: action.payload,
          fetching: false,
          error: null,
        },
      };
    case FETCH_SPONSOR_SITES_ERROR:
      return {
        ...state,
        sponsorSites: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
    case SUBMIT_SCHEDULE:
      return update(state, {
        schedules: {
          isSubmitting: { $set: true },
        }
      });
    case SUBMIT_SCHEDULE_SUCCESS:
      return update(state, {
        schedules: {
          isSubmitting: { $set: false },
          data: { $set: payload },
        }
      });
    case SUBMIT_SCHEDULE_ERROR:
      return update(state, {
        schedules: {
          isSubmitting: { $set: false },
          error: { $set: payload },
        }
      });
    case DELETE_SCHEDULE:
      return update(state, {
        schedules: {
          isDeleting: { $set: true },
        }
      });
    case DELETE_SCHEDULE_SUCCESS:
      return update(state, {
        schedules: {
          isDeleting: { $set: false },
          data: { $set: payload },
        }
      });
    case DELETE_SCHEDULE_ERROR:
      return update(state, {
        schedules: {
          isDeleting: { $set: false },
          error: { $set: payload },
        }
      });
    case SET_ACTIVE_SORT:
      return {
        ...state,
        paginationOptions: {
          activeSort: action.sort,
          activeDirection: action.direction,
        },
      };
    default:
      return state;
  }
}
