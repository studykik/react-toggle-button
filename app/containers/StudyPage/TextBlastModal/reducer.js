/**
 * Created by mike on 10/31/16.
 */

import _ from 'lodash';
import {
  FIND_PATIENTS_TEXT_BLAST_SUCCESS,
  FILTER_PATIENTS_TEXT_BLAST,
  ADD_PATIENTS_TO_TEXT_BLAST,
  REMOVE_PATIENT_FROM_TEXT_BLAST,
  REMOVE_PATIENTS_FROM_TEXT_BLAST,
} from '../constants';

export default function TextBlastModal(state, action) {
  switch (action.type) {
    case FIND_PATIENTS_TEXT_BLAST_SUCCESS:
      return {
        ...state,
        values: {
          ...state.values,
          filteredPatientSearchValues: action.payload,
          patientSearchValues: action.payload,
        },
      };
    case FILTER_PATIENTS_TEXT_BLAST: {
      // separate the first and last name apart
      let search = _.trim(action.text);
      // const firstNameEndIndex = search.indexOf(' ');
      // let firstName = search;
      // let lastName;
      // if (firstNameEndIndex !== -1) {
      //   firstName = search.slice(0, firstNameEndIndex);
      //   lastName = search.slice(firstNameEndIndex + 1);
      // }
      if (search) {
        search = search.toUpperCase();
      }
      return {
        ...state,
        values: {
          ...state.values,
          filteredPatientSearchValues: state.values.patientSearchValues.filter(patient => {
            let firstname = patient.firstName;
            let lastname = patient.lastName;
            if (firstname) {
              firstname = firstname.toUpperCase();
            }
            if (lastname) {
              lastname = lastname.toUpperCase();
            }
            return (firstname && _.includes(firstname, search)) || (lastname && _.includes(lastname, search));
          }),
        },
      };
    }
    case ADD_PATIENTS_TO_TEXT_BLAST:
      return {
        ...state,
        values: {
          ...state.values,
          patients: action.patients,
        },
      };
    case REMOVE_PATIENT_FROM_TEXT_BLAST:
      return {
        ...state,
        values: {
          ...state.values,
          patients: state.values.patients.filter(patient => (
            patient.id !== action.patient.id
          )),
        },
      };
    case REMOVE_PATIENTS_FROM_TEXT_BLAST:
      return {
        ...state,
        values: {
          ...state.values,
          patients: [],
        },
      };
    default:
      return state;
  }
}
