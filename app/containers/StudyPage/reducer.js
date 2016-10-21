/*
 *
 * ProfilePage reducer
 *
 */

import {
  ADD_PATIENT_INDICATION_SUCCESS,
  ADD_PATIENT_NOTE_SUCCESS,
  FETCH_CAMPAIGNS_SUCCESS,
  FETCH_PATIENTS_SUCCESS,
  FETCH_PATIENT_DETAILS_SUCCESS,
  FETCH_PATIENT_CATEGORIES_SUCCESS,
  FETCH_SITE_SUCCESS,
  FETCH_STUDY_VIEWS_SUCCESS,
  FETCH_STUDY_PATIENT_REFERRALS_SUCCESS,
  FETCH_STUDY_CALLS_SUCCESS,
  FETCH_STUDY_TEXTS_SUCCESS,
  FETCH_SOURCES_SUCCESS,
  FETCH_STUDY_SUCCESS,
  REMOVE_PATIENT_INDICATION_SUCCESS,
  SET_STUDY_ID,
  SET_SITE_ID,
  SET_CURRENT_PATIENT_ID,
  SET_CURRENT_PATIENT_CATEGORY_ID,
  SUBMIT_DELETE_NOTE_SUCCESS,
  UPDATE_PATIENT_SUCCESS,
} from './constants';
import _ from 'lodash';

const initialState = {
  stats: {},
};

function studyPageReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CAMPAIGNS_SUCCESS:
      return {
        ...state,
        campaigns: action.payload,
      };
    case FETCH_PATIENTS_SUCCESS:
      return {
        ...state,
        patientCategories: state.patientCategories.map(patientCategory => {
          // try to find the category in the payload
          let tempCategory = _.find(action.payload, category => (
            category.id === patientCategory.id
          ));
          // if it's not found, clear the patient list
          if (!tempCategory) {
            tempCategory = patientCategory;
            tempCategory.patients = [];
          }
          // return the payload as the mapping
          return tempCategory;
        }),
        fetchingPatients: false,
      };
    case ADD_PATIENT_INDICATION_SUCCESS:
    case ADD_PATIENT_NOTE_SUCCESS:
    case FETCH_PATIENT_DETAILS_SUCCESS:
    case REMOVE_PATIENT_INDICATION_SUCCESS:
    case SUBMIT_DELETE_NOTE_SUCCESS:
    case UPDATE_PATIENT_SUCCESS:
      return {
        ...state,
        patientCategories: patientCategories(state.patientCategories, state.currentPatientCategoryId, state.currentPatientId, action),
      };
    case FETCH_PATIENT_CATEGORIES_SUCCESS:
      return {
        ...state,
        patientCategories: action.payload.map(patientCategory => {
          const patientCategoryTemp = Object.assign({}, patientCategory);
          patientCategoryTemp.patients = [];
          return patientCategoryTemp;
        }),
      };
    case FETCH_SITE_SUCCESS:
      return {
        ...state,
        site: action.payload,
      };
    case FETCH_SOURCES_SUCCESS:
      return {
        ...state,
        sources: action.payload,
      };
    case FETCH_STUDY_SUCCESS:
      return {
        ...state,
        study: action.payload,
        fetchingStudy: false,
      };
    case FETCH_STUDY_VIEWS_SUCCESS:
      return {
        ...state,
        stats: {
          ...state.stats,
          views: action.payload,
        },
      };
    case FETCH_STUDY_PATIENT_REFERRALS_SUCCESS:
      return {
        ...state,
        stats: {
          ...state.stats,
          referrals: action.payload,
        },
      };
    case FETCH_STUDY_CALLS_SUCCESS:
      return {
        ...state,
        stats: {
          ...state.stats,
          calls: action.payload.count,
          callsDuration: action.payload.totalDuration,
        },
      };
    case FETCH_STUDY_TEXTS_SUCCESS:
      return {
        ...state,
        stats: {
          ...state.stats,
          texts: action.payload.total,
          textsSent: action.payload.sent,
          textsReceived: action.payload.received,
        },
      };
    case SET_STUDY_ID:
      return {
        ...state,
        studyId: action.id,
      };
    case SET_SITE_ID:
      return {
        ...state,
        siteId: action.id,
      };
    case SET_CURRENT_PATIENT_ID:
      return {
        ...state,
        currentPatientId: action.id,
      };
    case SET_CURRENT_PATIENT_CATEGORY_ID:
      return {
        ...state,
        currentPatientCategoryId: action.id,
      };
    default:
      return state;
  }
}

// additional reducer specifically for patient categories
function patientCategories(state, currentPatientCategoryId, currentPatientId, action) {
  switch (action.type) {
    case ADD_PATIENT_NOTE_SUCCESS:
    case ADD_PATIENT_INDICATION_SUCCESS:
    case REMOVE_PATIENT_INDICATION_SUCCESS:
    case SUBMIT_DELETE_NOTE_SUCCESS:
      return state.map(patientCategory => {
        if (patientCategory.id === currentPatientCategoryId) {
          return {
            ...patientCategory,
            patients: patients(patientCategory.patients, currentPatientId, action),
          };
        }
        return patientCategory;
      });
    case FETCH_PATIENT_DETAILS_SUCCESS:
    case UPDATE_PATIENT_SUCCESS:
      return state.map(patientCategory => {
        if (patientCategory.id === currentPatientCategoryId) {
          return {
            ...patientCategory,
            patients: patientCategory.patients.map(patient => {
              if (patient.id === currentPatientId) {
                return {
                  ...patient,
                  ...action.payload,
                };
              }
              return patient;
            }),
          };
        }
        return patientCategory;
      });
    default:
      return state;
  }
}

function patients(state, currentPatientId, action) {
  switch (action.type) {
    case ADD_PATIENT_INDICATION_SUCCESS:
      return state.map(patient => {
        if (patient.id === currentPatientId) {
          return {
            ...patient,
            indications: [
              ...patient.indications,
              action.indication,
            ],
          };
        }
        return patient;
      });
    case ADD_PATIENT_NOTE_SUCCESS:
      return state.map(patient => {
        if (patient.id === currentPatientId) {
          return {
            ...patient,
            notes: [
              ...patient.notes,
              {
                ...action.payload,
                user: action.currentUser,
              },
            ],
          };
        }
        return patient;
      });
    case REMOVE_PATIENT_INDICATION_SUCCESS:
      return state.map(patient => {
        if (patient.id === currentPatientId) {
          return {
            ...patient,
            indications: patient.indications.filter(indication => (
              indication.id !== action.indicationId
            )),
          };
        }
        return patient;
      });
    case SUBMIT_DELETE_NOTE_SUCCESS:
      return state.map(patient => {
        if (patient.id === currentPatientId) {
          return {
            ...patient,
            notes: patient.notes.filter(note => (
              note.id !== action.noteId
            )),
          };
        }
        return patient;
      });
    default:
      return state;
  }
}

export default studyPageReducer;
