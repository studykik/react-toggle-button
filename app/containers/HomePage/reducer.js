/* eslint-disable comma-dangle, no-case-declarations */
import _ from 'lodash';

import {
  FETCH_PATIENT_SIGN_UPS_SUCCEESS,
  FETCH_PATIENT_MESSAGES_SUCCEESS,
  FETCH_PRINCIPAL_INVESTIGATOR_TOTALS_SUCCEESS,
  FETCH_STUDIES,
  FETCH_STUDIES_SUCCESS,
  FETCH_STUDIES_ERROR,
  FETCH_PROTOCOLS,
  FETCH_PROTOCOLS_SUCCESS,
  FETCH_PROTOCOLS_ERROR,
  FETCH_PROTOCOL_NUMBERS,
  FETCH_PROTOCOL_NUMBERS_SUCCESS,
  FETCH_PROTOCOL_NUMBERS_ERROR,
  FETCH_INDICATIONS,
  FETCH_INDICATIONS_SUCCESS,
  FETCH_INDICATIONS_ERROR,
  FETCH_INDICATION_LEVEL_PRICE,
  FETCH_INDICATION_LEVEL_PRICE_SUCCESS,
  FETCH_INDICATION_LEVEL_PRICE_ERROR,
  CLEAR_INDICATION_LEVEL_PRICE,
  RENEW_STUDY,
  RENEW_STUDY_SUCCESS,
  RENEW_STUDY_ERROR,
  UPGRADE_STUDY,
  UPGRADE_STUDY_SUCCESS,
  UPGRADE_STUDY_ERROR,
  EDIT_STUDY,
  EDIT_STUDY_SUCCESS,
  EDIT_STUDY_ERROR,
  SET_ACTIVE_SORT,
  NEW_MESSAGE_FOR_PROTOCOL,
  SORT_SUCCESS,
} from './constants';

import {
  ADD_EMAIL_NOTIFICATION_USER,
  ADD_EMAIL_NOTIFICATION_USER_SUCCESS,
  ADD_EMAIL_NOTIFICATION_USER_ERROR,
  FETCH_CLIENT_ADMINS,
  FETCH_CLIENT_ADMINS_SUCCESS,
  FETCH_CLIENT_ADMINS_ERROR,
} from '../../containers/App/constants';

import {
  RECEIVE_NOTIFICATION,
  SEND_STUDY_PATIENT_MESSAGES,
} from '../../containers/GlobalNotifications/constants';

const initialState = {
  patientSignUps: {
    today: 0,
    yesterday: 0,
    total: 0,
  },
  principalInvestigatorTotals: {
    active: 0,
    inactive: 0,
    total: 0,
  },
  patientMessages: {
    unreadTexts: 0,
    unreadEmails: 0,
    total: 0,
  },
  studies: {
    details: [],
    fetching: false,
    error: null,
  },
  protocols: {
    details: [],
    fetching: false,
    error: null,
  },
  protocolNumbers: {
    details: [],
    fetching: false,
    error: null,
  },
  indications: {
    details: [],
    fetching: false,
    error: null,
  },
  selectedIndicationLevelPrice: {
    details: null,
    fetching: false,
    error: null,
  },
  renewedStudy: {
    details: null,
    submitting: false,
    error: null,
  },
  upgradedStudy: {
    details: null,
    submitting: false,
    error: null,
  },
  editedStudy: {
    details: null,
    submitting: false,
    error: null,
  },
  paginationOptions: {
    activeSort: null,
    activeDirection: null,
  },
  addNotificationProcess: {
    saving: false,
    error: null,
    savedUser: null,
  },
  clientAdmins: {
    details: [],
    fetching: false,
    error: null,
  },
};

export default function homePageReducer(state = initialState, action) {
  const { payload } = action;
  let newState;
  let protocols;

  switch (action.type) {
    case FETCH_PATIENT_SIGN_UPS_SUCCEESS:
      return {
        ...state,
        patientSignUps: {
          today: payload.today,
          yesterday: payload.yesterday,
          total: payload.total,
        },
      };
    case FETCH_PATIENT_MESSAGES_SUCCEESS:
      return {
        ...state,
        patientMessages: {
          unreadTexts: payload.unreadTexts,
          unreadEmails: payload.unreadEmails,
          total: payload.total,
        },
      };
    case FETCH_PRINCIPAL_INVESTIGATOR_TOTALS_SUCCEESS:
      return {
        ...state,
        principalInvestigatorTotals: {
          active: payload.active,
          inactive: payload.inactive,
          total: payload.total,
        },
      };
    case SEND_STUDY_PATIENT_MESSAGES:
      newState = state;
      return {
        ...state,
        patientMessages: {
          unreadTexts: newState.patientMessages.unreadTexts,
          unreadEmails: newState.patientMessages.unreadEmails,
          total: newState.patientMessages.total + 1,
        },
      };
    case RECEIVE_NOTIFICATION:
      newState = state;
      switch (action.payload.event) {
        case 'create-patient':
          newState = {
            ...state,
            patientSignUps: {
              today: newState.patientSignUps.today + 1,
              yesterday: newState.patientSignUps.yesterday,
            },
          };
          break;
        case 'twilio-message':
          newState = {
            ...state,
            patientMessages: {
              unreadTexts: newState.patientMessages.unreadTexts + 1,
              unreadEmails: newState.patientMessages.unreadEmails,
              total: newState.patientMessages.total + 1,
            },
          };
          break;
        case 'create-reward':
          newState = {
            ...state,
            rewardsPoint: newState.rewardsPoint + action.payload.event_params.points
          };
          break;
        default:
          break;
      }
      return newState;
    case FETCH_STUDIES:
      return {
        ...state,
        studies: {
          details: [],
          fetching: true,
          error: null,
        },
      };
    case FETCH_STUDIES_SUCCESS: {
      const cDate = new Date();
      // const dateFrom = campaign.dateFrom ? new Date(campaign.dateFrom) : null
      // const dateTo = campaign.dateTo ? new Date(campaign.dateTo) : null
      //
      // const dateFromStr = dateFrom ? moment(dateFrom).format('MMMM Do, YYYY') : 'To Be Determined'
      // const dateToStr = dateTo ? moment(dateTo).format('MMMM Do, YYYY') : 'To Be Determined'
      const entitiesCollection = payload.map((studyObject, index) => ({
        studyId: studyObject.id,
        indication: studyObject.indication,
        location: studyObject.site.location,
        siteName: studyObject.site.siteName,
        sponsor: studyObject.sponsor.name,
        protocol: studyObject.protocolNumber,
        patientMessagingSuite: studyObject.patientMessagingSuite ? 'On' : 'Off',
        patientQualificationSuite: studyObject.patientQualificationSuite ? 'On' : 'Off',
        status: studyObject.status,
        callTracking: studyObject.callTracking,
        startDate: studyObject.campaigns[0].dateFrom,
        endDate: studyObject.campaigns[0].dateTo,
        level_id: studyObject.campaigns[0].level_id,
        campaignId: studyObject.campaigns[0].campaignId,
        campaignlength: studyObject.campaigns[0].length,
        orderNumber: (index + 1),
        siteId: studyObject.site.id,
        campaignLastDate: studyObject.campaignLastDate,
        url: studyObject.url,
      }));
      const nEntities = [];
      _.forEach(entitiesCollection, (item) => {
        const foundItemIndex = _.findIndex(nEntities, { indication : item.indication, protocol : item.protocol });

        if (foundItemIndex !== -1) {
          const sItem = nEntities[foundItemIndex];
          if (!sItem.startDate) {
            nEntities[foundItemIndex] = item;
          } else if (sItem.startDate && item.startDate) {
            const sStartDate = new Date(sItem.startDate);
            const sEndDate = new Date(sItem.endDate);
            const nStartDate = new Date(item.startDate);
            const nEndDate = new Date(item.endDate);
            if (nStartDate <= cDate && nEndDate >= cDate) {
              nEntities[foundItemIndex] = item;
            } else if (sStartDate >= cDate || sEndDate <= cDate) {
              const sDiff = sStartDate.getTime() - cDate.getTime();
              const nDiff = nStartDate.getTime() - cDate.getTime();
              if (sDiff < 0 && nDiff > 0) {
                nEntities[foundItemIndex] = item;
              } else if (sDiff < 0 && nDiff < 0) {
                if (nDiff > sDiff) {
                  nEntities[foundItemIndex] = item;
                }
              } else if (sDiff > 0 && nDiff > 0) {
                if (nDiff < sDiff) {
                  nEntities[foundItemIndex] = item;
                }
              }
            }
          }
        } else {
          nEntities.push(item);
        }
      });
      return {
        ...state,
        studies: {
          details: nEntities,
          fetching: false,
          error: null,
        },
      };
    }
    case FETCH_STUDIES_ERROR:
      return {
        ...state,
        studies: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
    case FETCH_PROTOCOLS:
      return {
        ...state,
        protocols: {
          details: [],
          fetching: true,
          error: null,
        },
      };
    case FETCH_PROTOCOLS_SUCCESS:
      return {
        ...state,
        protocols: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
    case FETCH_PROTOCOLS_ERROR:
      return {
        ...state,
        protocols: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
    case FETCH_PROTOCOL_NUMBERS:
      return {
        ...state,
        protocolNumbers: {
          details: [],
          fetching: true,
          error: null,
        },
      };
    case FETCH_PROTOCOL_NUMBERS_SUCCESS:
      return {
        ...state,
        protocolNumbers: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
    case FETCH_PROTOCOL_NUMBERS_ERROR:
      return {
        ...state,
        protocolNumbers: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
    case FETCH_INDICATIONS:
      return {
        ...state,
        indications: {
          details: [],
          fetching: true,
          error: null,
        },
      };
    case FETCH_INDICATIONS_SUCCESS:
      return {
        ...state,
        indications: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
    case FETCH_INDICATIONS_ERROR:
      return {
        ...state,
        indications: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
    case FETCH_INDICATION_LEVEL_PRICE:
      return {
        ...state,
        selectedIndicationLevelPrice: {
          details: null,
          fetching: true,
          error: null,
        },
      };
    case FETCH_INDICATION_LEVEL_PRICE_SUCCESS:
      return {
        ...state,
        selectedIndicationLevelPrice: {
          details: payload.price,
          fetching: false,
          error: null,
        },
      };
    case FETCH_INDICATION_LEVEL_PRICE_ERROR:
      return {
        ...state,
        selectedIndicationLevelPrice: {
          details: null,
          fetching: false,
          error: payload,
        },
      };
    case CLEAR_INDICATION_LEVEL_PRICE:
      return {
        ...state,
        selectedIndicationLevelPrice: {
          details: null,
          fetching: false,
          error: null,
        },
      };
    case RENEW_STUDY:
      return {
        ...state,
        renewedStudy: {
          details: null,
          submitting: true,
          error: null,
        },
      };
    case RENEW_STUDY_SUCCESS:
      return {
        ...state,
        renewedStudy: {
          details: payload,
          submitting: false,
          error: null,
        },
      };
    case RENEW_STUDY_ERROR:
      return {
        ...state,
        renewedStudy: {
          details: null,
          submitting: false,
          error: payload,
        },
      };
    case UPGRADE_STUDY:
      return {
        ...state,
        upgradedStudy: {
          details: null,
          submitting: true,
          error: null,
        },
      };
    case UPGRADE_STUDY_SUCCESS:
      const studies = _.cloneDeep(state.studies.details);
      const study = _.find(studies, (o) => (o.studyId === payload.studyId));
      study.level_id = payload.newLevelId;
      return {
        ...state,
        studies: {
          details: studies,
          fetching: false,
          error: null,
        },
        upgradedStudy: {
          details: payload,
          submitting: false,
          error: null,
        },
      };
    case UPGRADE_STUDY_ERROR:
      return {
        ...state,
        upgradedStudy: {
          details: null,
          submitting: false,
          error: payload,
        },
      };
    case EDIT_STUDY:
      return {
        ...state,
        editedStudy: {
          details: null,
          submitting: true,
          error: null,
        },
      };
    case EDIT_STUDY_SUCCESS:
      return {
        ...state,
        editedStudy: {
          details: payload,
          submitting: false,
          error: null,
        },
      };
    case EDIT_STUDY_ERROR:
      return {
        ...state,
        editedStudy: {
          details: null,
          submitting: false,
          error: payload,
        },
      };
    case SET_ACTIVE_SORT:
      return {
        ...state,
        paginationOptions: {
          activeSort: action.sort,
          activeDirection: action.direction,
        },
      };
    case SORT_SUCCESS:
      return {
        ...state,
        studies: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
    case ADD_EMAIL_NOTIFICATION_USER:
      return {
        ...state,
        addNotificationProcess: {
          saving: true,
          error: null,
          savedUser: null,
        },
      };
    case ADD_EMAIL_NOTIFICATION_USER_SUCCESS:
      return {
        ...state,
        addNotificationProcess: {
          saving: false,
          error: null,
          savedUser: action.payload,
        },
      };
    case ADD_EMAIL_NOTIFICATION_USER_ERROR:
      return {
        ...state,
        addNotificationProcess: {
          saving: false,
          error: action.payload,
          savedUser: null,
        },
      };
    case NEW_MESSAGE_FOR_PROTOCOL:
      protocols = _.cloneDeep(state.protocols.details);
      _.forEach(protocols, (item, index) => {
        if (item.protocolNumber === action.protocolNumber) {
          protocols[index].unreadMessageCount = item.unreadMessageCount ? (parseInt(item.unreadMessageCount) + 1).toString() : '1';
        }
      });
      return {
        ...state,
        protocols: {
          details: protocols,
          fetching: false,
          error: null,
        },
      };
    case FETCH_CLIENT_ADMINS:
      return {
        ...state,
        clientAdmins: {
          details: [],
          fetching: true,
          error: null,
        },
      };
    case FETCH_CLIENT_ADMINS_SUCCESS:
      return {
        ...state,
        clientAdmins: {
          details: action.payload,
          fetching: false,
          error: null,
        },
      };
    case FETCH_CLIENT_ADMINS_ERROR:
      return {
        ...state,
        clientAdmins: {
          details: [],
          fetching: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
}
