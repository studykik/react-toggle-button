/*
 *
 * ProfilePage actions
 *
 */

import {
  CLEAR_FORM_UPLOAD,
  FIND_PATIENTS_TEXT_BLAST,
  FIND_PATIENTS_TEXT_BLAST_SUCCESS,
  FILTER_PATIENTS_TEXT_BLAST,
  ADD_PATIENTS_TO_TEXT_BLAST,
  REMOVE_PATIENT_FROM_TEXT_BLAST,
  REMOVE_PATIENTS_FROM_TEXT_BLAST,
  FETCHING_STUDY,
  FETCH_CAMPAIGNS_SUCCESS,
  FETCH_PATIENTS,
  FETCH_PATIENTS_SUCCESS,
  FETCH_PATIENT_DETAILS,
  FETCH_PATIENT_DETAILS_SUCCESS,
  FETCH_PATIENT_CATEGORIES,
  FETCH_PATIENT_CATEGORIES_SUCCESS,
  FETCH_STUDY,
  FETCH_PROTOCOL_SUCCESS,
  FETCH_SITE_SUCCESS,
  FETCH_STUDY_VIEWS_SUCCESS,
  FETCH_STUDY_PATIENT_REFERRALS_SUCCESS,
  FETCH_STUDY_CALLS_SUCCESS,
  FETCH_STUDY_TEXTS_SUCCESS,
  FETCH_SOURCES_SUCCESS,
  FETCH_STUDY_SUCCESS,
  EXPORT_PATIENTS,
  EXPORT_PATIENTS_SUCCESS,
  READ_STUDY_PATIENT_MESSAGES,
  READ_STUDY_PATIENT_MESSAGES_SUCCESS,
  READ_STUDY_PATIENT_MESSAGES_ERROR,
  SET_STUDY_ID,
  SET_CURRENT_PATIENT_ID,
  SET_CURRENT_PATIENT_CATEGORY_ID,
  SET_OPEN_PATIENT_MODAL,
  SCHEDULE_PATIENT,
  SHOW_SCHEDULED_MODAL,
  HIDE_SCHEDULED_MODAL,
  SUBMIT_MOVE_PATIENT_BETWEEN_CATEGORIES,
  MOVE_PATIENT_BETWEEN_CATEGORIES_LOADING,
  MOVE_PATIENT_BETWEEN_CATEGORIES_SUCCESS,
  MOVE_PATIENT_BETWEEN_CATEGORIES_FAILED,
  SUBMIT_ADD_PATIENT_SUCCESS,
  SUBMIT_TEXT_BLAST,
  SUBMIT_PATIENT_IMPORT,
  SUBMIT_ADD_PATIENT,
  ADD_PATIENT_INDICATION,
  SUBMIT_ADD_PATIENT_FAILURE,
  REMOVE_PATIENT_INDICATION,
  SUBMIT_PATIENT_UPDATE,
  SUBMIT_PATIENT_NOTE,
  SUBMIT_DELETE_NOTE,
  SUBMIT_DELETE_NOTE_SUCCESS,
  SUBMIT_PATIENT_TEXT,
  ADD_PATIENT_INDICATION_SUCCESS,
  REMOVE_PATIENT_INDICATION_SUCCESS,
  UPDATE_PATIENT_SUCCESS,
  ADD_PATIENT_NOTE_SUCCESS,
  ADD_PATIENT_TEXT_SUCCESS,
  SWITCH_TO_NOTE_SECTION_DETAIL,
  SWITCH_TO_TEXT_SECTION_DETAIL,
  SWITCH_TO_EMAIL_SECTION_DETAIL,
  SWITCH_TO_OTHER_SECTION_DETAIL,
  FETCH_STUDY_NEW_TEXTS,
  CHANGE_SCHEDULED_DATE,
  SUBMIT_SCHEDULE,
  SUBMIT_SCHEDULE_SUCCEEDED,
  SUBMIT_SCHEDULE_FAILED,
  SET_SCHEDULED_FORM_INITIALIZED,
  FETCH_PATIENTS_ERROR,
  DELETE_PATIENT,
  DELETE_PATIENT_SUCCESS,
  DELETE_PATIENT_ERROR,
} from './constants';

export function campaignsFetched(payload) {
  return {
    type: FETCH_CAMPAIGNS_SUCCESS,
    payload,
  };
}

export function clearForm() {
  return {
    type: CLEAR_FORM_UPLOAD,
  };
}

export function fetchingStudy() {
  return {
    type: FETCHING_STUDY,
  };
}

export function findPatientsForTextBlast(studyId, text, categoryIds, sourceIds, campaignId) {
  return {
    type: FIND_PATIENTS_TEXT_BLAST,
    studyId,
    text,
    categoryIds,
    sourceIds,
    campaignId,
  };
}

export function findPatientsForTextBlastSuccess(payload) {
  return {
    type: FIND_PATIENTS_TEXT_BLAST_SUCCESS,
    payload,
  };
}

export function filterPatientsForTextBlast(text) {
  return {
    type: FILTER_PATIENTS_TEXT_BLAST,
    text,
  };
}

export function addPatientsToTextBlast(patients) {
  return {
    type: ADD_PATIENTS_TO_TEXT_BLAST,
    patients,
  };
}

export function removePatientFromTextBlast(patient) {
  return {
    type: REMOVE_PATIENT_FROM_TEXT_BLAST,
    patient,
  };
}

export function removePatientsFromTextBlast() {
  return {
    type: REMOVE_PATIENTS_FROM_TEXT_BLAST,
  };
}

export function fetchPatients(studyId, text, campaignId, sourceId) {
  return {
    type: FETCH_PATIENTS,
    studyId,
    text,
    campaignId,
    sourceId,
  };
}

export function exportPatients(studyId, text, campaignId, sourceId) {
  return {
    type: EXPORT_PATIENTS,
    studyId,
    text,
    campaignId,
    sourceId,
  };
}

export function patientsExported() {
  return {
    type: EXPORT_PATIENTS_SUCCESS,
  };
}

export function setStudyId(id) {
  return {
    type: SET_STUDY_ID,
    id,
  };
}

export function patientsFetched(payload) {
  return {
    type: FETCH_PATIENTS_SUCCESS,
    payload,
  };
}

export function patientsFetchedError(payload) {
  return {
    type: FETCH_PATIENTS_ERROR,
    payload,
  };
}

export function fetchPatientDetails(patientId) {
  return {
    type: FETCH_PATIENT_DETAILS,
    patientId,
  };
}

export function patientDetailsFetched(patientId, payload) {
  return {
    type: FETCH_PATIENT_DETAILS_SUCCESS,
    patientId,
    payload,
  };
}

export function fetchPatientCategories(studyId) {
  return {
    type: FETCH_PATIENT_CATEGORIES,
    studyId,
  };
}

export function patientCategoriesFetched(payload) {
  return {
    type: FETCH_PATIENT_CATEGORIES_SUCCESS,
    payload,
  };
}

export function fetchStudy(studyId, campaignId) {
  return {
    type: FETCH_STUDY,
    studyId,
    campaignId,
  };
}

export function protocolFetched(payload) {
  return {
    type: FETCH_PROTOCOL_SUCCESS,
    payload,
  };
}

export function siteFetched(payload) {
  return {
    type: FETCH_SITE_SUCCESS,
    payload,
  };
}

export function sourcesFetched(payload) {
  return {
    type: FETCH_SOURCES_SUCCESS,
    payload,
  };
}

export function studyFetched(payload) {
  return {
    type: FETCH_STUDY_SUCCESS,
    payload,
  };
}

export function studyViewsStatFetched(payload) {
  return {
    type: FETCH_STUDY_VIEWS_SUCCESS,
    payload,
  };
}

export function readStudyPatientMessages(patientId) {
  return {
    type: READ_STUDY_PATIENT_MESSAGES,
    patientId,
  };
}

export function readStudyPatientMessagesSuccess(payload) {
  return {
    type: READ_STUDY_PATIENT_MESSAGES_SUCCESS,
    payload,
  };
}

export function readStudyPatientMessagesError(payload) {
  return {
    type: READ_STUDY_PATIENT_MESSAGES_ERROR,
    payload,
  };
}

export function patientReferralStatFetched(payload) {
  return {
    type: FETCH_STUDY_PATIENT_REFERRALS_SUCCESS,
    payload,
  };
}

export function callStatsFetched(payload) {
  return {
    type: FETCH_STUDY_CALLS_SUCCESS,
    payload,
  };
}

export function textStatsFetched(payload) {
  return {
    type: FETCH_STUDY_TEXTS_SUCCESS,
    payload,
  };
}

export function setCurrentPatientId(id) {
  return {
    type: SET_CURRENT_PATIENT_ID,
    id,
  };
}

export function setCurrentPatientCategoryId(id) {
  return {
    type: SET_CURRENT_PATIENT_CATEGORY_ID,
    id,
  };
}

export function setOpenPatientModal(show) {
  return {
    type: SET_OPEN_PATIENT_MODAL,
    show,
  };
}

export function addPatientIndication(patientId, indication) {
  return {
    type: ADD_PATIENT_INDICATION,
    patientId,
    indication,
  };
}

export function removePatientIndication(patientId, indicationId) {
  return {
    type: REMOVE_PATIENT_INDICATION,
    patientId,
    indicationId,
  };
}

export function submitPatientUpdate(patientId, fields) {
  return {
    type: SUBMIT_PATIENT_UPDATE,
    patientId,
    fields,
  };
}

export function addPatientIndicationSuccess(patientId, indication, isOriginal) {
  return {
    type: ADD_PATIENT_INDICATION_SUCCESS,
    patientId,
    indication,
    isOriginal,
  };
}

export function removePatientIndicationSuccess(patientId, indicationId, payload) {
  return {
    type: REMOVE_PATIENT_INDICATION_SUCCESS,
    patientId,
    indicationId,
    payload,
  };
}

export function updatePatientSuccess(payload) {
  return {
    type: UPDATE_PATIENT_SUCCESS,
    payload,
  };
}

export function addPatientNoteSuccess(currentUser, payload) {
  return {
    type: ADD_PATIENT_NOTE_SUCCESS,
    currentUser,
    payload,
  };
}

export function addPatientTextSuccess(payload) {
  return {
    type: ADD_PATIENT_TEXT_SUCCESS,
    payload,
  };
}

export function schedulePatient(studyId, fromCategoryId, toCategoryId, patientId) {
  return {
    type: SCHEDULE_PATIENT,
    studyId,
    fromCategoryId,
    toCategoryId,
    patientId,
  };
}

export function submitMovePatientBetweenCategories(studyId, fromCategoryId, toCategoryId, patientId, afterPatientId) {
  return {
    type: SUBMIT_MOVE_PATIENT_BETWEEN_CATEGORIES,
    studyId,
    fromCategoryId,
    toCategoryId,
    patientId,
    afterPatientId,
  };
}

export function movePatientBetweenCategoriesLoading() {
  return {
    type: MOVE_PATIENT_BETWEEN_CATEGORIES_LOADING,
  };
}

export function movePatientBetweenCategoriesSuccess(fromCategoryId, toCategoryId, orderNumber, patientId, updatedAt) {
  return {
    type: MOVE_PATIENT_BETWEEN_CATEGORIES_SUCCESS,
    fromCategoryId,
    toCategoryId,
    orderNumber,
    patientId,
    updatedAt,
  };
}

export function movePatientBetweenCategoriesFailed() {
  return {
    type: MOVE_PATIENT_BETWEEN_CATEGORIES_FAILED,
  };
}


export function showScheduledModal(modalType) {
  return {
    type: SHOW_SCHEDULED_MODAL,
    modalType,
  };
}

export function hideScheduledModal() {
  return {
    type: HIDE_SCHEDULED_MODAL,
  };
}

export function submitTextBlast(patients, message, clientRoleId, onClose) {
  return {
    type: SUBMIT_TEXT_BLAST,
    patients,
    message,
    clientRoleId,
    onClose,
  };
}

export function fetchStudyTextNewStats(studyId) {
  return {
    type: FETCH_STUDY_NEW_TEXTS,
    studyId,
  };
}

export function submitPatientNote(studyId, patientId, currentUser, note) {
  return {
    type: SUBMIT_PATIENT_NOTE,
    studyId,
    patientId,
    currentUser,
    note,
  };
}

export function submitDeleteNote(patientId, noteId) {
  return {
    type: SUBMIT_DELETE_NOTE,
    patientId,
    noteId,
  };
}

export function deletePatientNoteSuccess(noteId) {
  return {
    type: SUBMIT_DELETE_NOTE_SUCCESS,
    noteId,
  };
}

export function submitPatientText(studyId, patientId, text) {
  return {
    type: SUBMIT_PATIENT_TEXT,
    studyId,
    patientId,
    text,
  };
}

export function submitPatientImport(clientId, studyId, file, onClose) {
  return {
    type: SUBMIT_PATIENT_IMPORT,
    clientId,
    studyId,
    file,
    onClose,
  };
}

export function submitAddPatient(studyId, patient, onClose) {
  return {
    type: SUBMIT_ADD_PATIENT,
    studyId,
    patient,
    onClose,
  };
}

export function submitAddPatientSuccess(patients, fileName) {
  return {
    type: SUBMIT_ADD_PATIENT_SUCCESS,
    patients,
    fileName,
  };
}

export function submitAddPatientFailure() {
  return {
    type: SUBMIT_ADD_PATIENT_FAILURE,
  };
}

export function switchToNoteSectionDetail() {
  return {
    type: SWITCH_TO_NOTE_SECTION_DETAIL,
  };
}

export function switchToTextSectionDetail() {
  return {
    type: SWITCH_TO_TEXT_SECTION_DETAIL,
  };
}

export function switchToEmailSectionDetail() {
  return {
    type: SWITCH_TO_EMAIL_SECTION_DETAIL,
  };
}

export function switchToOtherSectionDetail() {
  return {
    type: SWITCH_TO_OTHER_SECTION_DETAIL,
  };
}

export function changeScheduledDate(date) {
  return {
    type: CHANGE_SCHEDULED_DATE,
    date,
  };
}

export function submitSchedule(data, fromCategoryId, scheduledCategoryId) {
  return {
    type: SUBMIT_SCHEDULE,
    data,
    fromCategoryId,
    scheduledCategoryId,
  };
}

export function submitScheduleSucceeded(schedules, patientId) {
  return {
    type: SUBMIT_SCHEDULE_SUCCEEDED,
    schedules,
    patientId,
  };
}

export function submitScheduleFailed() {
  return {
    type: SUBMIT_SCHEDULE_FAILED,
  };
}

export function setScheduledFormInitialized(formInitialized) {
  return {
    type: SET_SCHEDULED_FORM_INITIALIZED,
    formInitialized,
  };
}

export function deletePatient(id) {
  return {
    type: DELETE_PATIENT,
    id,
  };
}

export function deletePatientSuccess(payload) {
  return {
    type: DELETE_PATIENT_SUCCESS,
    payload,
  };
}

export function deletePatientError(payload) {
  return {
    type: DELETE_PATIENT_ERROR,
    payload,
  };
}

