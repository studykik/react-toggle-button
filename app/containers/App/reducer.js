/* eslint-disable no-case-declarations */

import { forEach, map, remove, cloneDeep, findIndex, concat, sortBy } from 'lodash';
import { getItem } from '../../utils/localStorage';

import {
  SET_AUTH_STATE,
  SET_USER_DATA,

  FETCH_INDICATIONS_SUCCESS,
  FETCH_SOURCES_SUCCESS,
  FETCH_LEVELS_SUCCESS,

  FETCH_COUPON,
  FETCH_COUPON_SUCCESS,
  FETCH_COUPON_ERROR,

  CLEAR_COUPON,

  FETCH_REWARDS,
  FETCH_REWARDS_SUCCESS,
  FETCH_REWARDS_ERROR,

  FETCH_REWARDS_BALANCE_SUCCESS,
  REDEEM_SUCCESS,

  FETCH_CARDS,
  FETCH_CARDS_SUCCESS,
  FETCH_CARDS_ERROR,

  FETCH_PROTOCOLS,
  FETCH_PROTOCOLS_SUCCESS,
  FETCH_PROTOCOLS_ERROR,

  SAVE_CARD,
  SAVE_CARD_SUCCESS,
  SAVE_CARD_ERROR,

  DELETE_CARD,
  DELETE_CARD_SUCCESS,
  DELETE_CARD_ERROR,

  ADD_CREDITS,
  ADD_CREDITS_SUCCESS,
  ADD_CREDITS_ERROR,
  FETCH_EVENTS,

  FETCH_CLIENT_SITES,
  FETCH_CLIENT_SITES_SUCCESS,
  FETCH_CLIENT_SITES_ERROR,

  FETCH_SITE_PATIENTS,
  FETCH_SITE_PATIENTS_SUCCESS,
  FETCH_SITE_PATIENTS_ERROR,
  UPDATE_SITE_PATIENTS,

  FETCH_CLIENT_CREDITS,
  FETCH_CLIENT_CREDITS_SUCCESS,
  FETCH_CLIENT_CREDITS_ERROR,

  FETCH_PATIENT_MESSAGES,
  FETCH_PATIENT_MESSAGES_SUCCESS,
  FETCH_PATIENT_MESSAGES_ERROR,
  UPDATE_PATIENT_MESSAGES,

  FETCH_PATIENT_MESSAGE_UNREAD_COUNT_SUCCESS,

  SEARCH_SITE_PATIENTS_SUCCESS,
  SEARCH_SITE_PATIENTS_ERROR,

  MARK_AS_READ_PATIENT_MESSAGES,

  FETCH_CLIENT_ROLES,
  FETCH_CLIENT_ROLES_SUCCESS,
  FETCH_CLIENT_ROLES_ERROR,

  FETCH_SITE,
  FETCH_SITE_SUCCESS,
  FETCH_SITE_ERROR,

  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,

  CLEAR_SELECTED_SITE,
  CLEAR_SELECTED_USER,

  DELETE_USER,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,

  DELETE_CLIENT_ROLE,
  DELETE_CLIENT_ROLE_SUCCESS,
  DELETE_CLIENT_ROLE_ERROR,

  SAVE_SITE,
  SAVE_SITE_SUCCESS,
  SAVE_SITE_ERROR,

  SAVE_USER,
  SAVE_USER_SUCCESS,
  SAVE_USER_ERROR,

  GET_CREDITS_PRICE_SUCCESS,

  CHANGE_USERS_TIMEZONE,
  CHANGE_USERS_TIMEZONE_SUCCESS,
  CHANGE_USERS_TIMEZONE_ERROR,

  FETCH_LANDING,
  FETCH_LANDING_SUCCESS,
  FETCH_LANDING_ERROR,
  CLEAR_LANDING,
  PATIENT_SUBSCRIBED,
  PATIENT_SUBSCRIPTION_ERROR,
  FIND_OUT_PATIENTS_POSTED,

  CLINICAL_TRIALS_SEARCH,
  CLINICAL_TRIALS_SEARCH_SUCCESS,
  CLEAR_CLINICAL_TRIALS_SEARCH,
  LIST_SITE_NOW_SUCCESS,
  RESET_LIST_SITE_NOW_SUCCESS,
  GET_PROPOSAL_SUCCESS,
  RESET_GET_PROPOSAL_SUCCESS,
  LEARN_ABOUT_FUTURE_TRIALS_SUCCESS,
  RESET_LEARN_ABOUT_FUTURE_TRIALS,
  NEW_CONTACT_SUCCESS,
  RESET_NEW_CONTACT_SUCCESS,

  GET_CNS_INFO_SUCCESS,
  SUBMIT_CNS,
  SUBMIT_CNS_SUCCESS,
  SUBMIT_CNS_ERROR,
} from './constants';

import {
  LOGIN_ERROR,
} from '../../containers/LoginPage/constants';

import {
  CHANGE_IMAGE_SUCCESS,
} from '../../containers/ProfilePage/constants';

import {
  SORT_SUCCESS,
} from '../../containers/HomePage/constants';

const initialState = {
  loggedIn: !!getItem('auth_token'),
  loginError: null,
  userData: null,
  pageEvents: null,
  baseData: {
    studies: {
      details: [],
      fetching: false,
      error: null,
    },
    sites: {
      details: [],
      fetching: false,
      error: null,
    },
    indications: [],
    subscriptionError: null,
    subscribedFromLanding: null,
    findOutPosted: null,
    listSiteNowSuccess: null,
    getProposalSuccess: null,
    learnAboutFutureTrialsSuccess: null,
    newContactsSuccess: null,
    sources: [],
    levels: [],
    landing: {
      details: null,
      fetching: false,
      error: null,
    },
    coupon: {
      details: null,
      fetching: false,
      error: null,
    },
    cards: {
      details: null,
      fetching: false,
      error: null,
    },
    trials: {
      details: null,
      total: null,
      wrongPostalCode: false,
      fetching: false,
      error: null,
    },
    savedCard: {
      details: null,
      saving: false,
      error: null,
    },
    deletedCard: {
      details: null,
      deleting: false,
      error: null,
    },
    addCredits: {
      details: null,
      adding: false,
      error: null,
    },
    clientSites: {
      details: [],
      fetching: false,
      error: null,
    },
    sitePatients: {
      details: [],
      fetching: false,
      error: null,
    },
    clientCredits: {
      details: {},
      fetching: false,
      error: null,
    },
    patientMessages: {
      details: [],
      fetching: false,
      error: null,
      stats: {
        unreadText: 0,
        unreadEmails: 0,
        total: 0,
      },
    },
    rewards: [],
    rewardsBalance: {},
    protocols: {
      details: [],
      fetching: false,
      error: null,
    },
    clientRoles: {
      details: [],
      fetching: false,
      error: null,
    },
    selectedSite: {
      details: null,
      fetching: false,
      error: null,
    },
    selectedUser: {
      details: null,
      fetching: false,
      error: null,
    },
    deletedUser: {
      details: null,
      deleting: false,
      error: null,
    },
    deletedClientRole: {
      details: null,
      deleting: false,
      error: null,
    },
    savedSite: {
      details: null,
      saving: false,
      error: null,
    },
    savedUser: {
      details: null,
      saving: false,
      error: null,
    },
    availPhoneNumbers: [],
    creditsPrice: {},
    changeUsersTimezoneState: {
      saving: false,
    },
    globalPMSPaginationOptions: {
      hasMoreItems: true,
      page: 1,
      search: '',
    },
    cnsInfo: {
      details: {},
      fetching: false,
      error: null,
    },
    cnsSubmitProcess: {},
  },
};

export default function appReducer(state = initialState, action) {
  const { payload } = action;
  let foundIndex = -1;
  const cardsCollection = cloneDeep(state.baseData.cards.details);
  const clientSitesCollection = map(state.baseData.clientSites.details, cloneDeep);
  const clientRolesCollection = map(state.baseData.clientRoles.details, cloneDeep);
  const sitesCopy = map(state.baseData.sites.details, cloneDeep);
  const patientsCopy = cloneDeep(state.baseData.sitePatients.details);
  let sitePatientsCollection = [];
  let unreadCount = 0;
  let patientMessagesCollection = [];
  let baseDataInnerState = null;
  let resultState = null;
  let userRoleType = '';
  let temRoleID = null;
  let newPatientsList = [];

  switch (action.type) {
    case SET_AUTH_STATE:
      resultState = {
        ...state,
        loggedIn: payload.newAuthState,
      };
      break;
    case LOGIN_ERROR:
      resultState = {
        ...state,
        loginError: payload,
      };
      break;
    case SET_USER_DATA:
      if (payload.userData) {
        if (payload.userData.roleForSponsor) {
          userRoleType = 'sponsor';
        } else if (payload.userData.roleForClient) {
          userRoleType = 'client';
        } else if (payload.userData.roles && payload.userData.roles.length > 0) {
          userRoleType = 'dashboard';
        } else {
          userRoleType = '';
        }
      }
      resultState = {
        ...state,
        userData: payload.userData,
        userRoleType,
      };
      break;
    case CHANGE_IMAGE_SUCCESS:
      resultState = {
        ...state,
        userData: { ...state.userData, profileImageURL: payload.profileImageURL },
      };
      break;
    case FETCH_EVENTS:
      resultState = {
        ...state,
        pageEvents: payload,
      };
      break;
    case FETCH_INDICATIONS_SUCCESS:
      baseDataInnerState = {
        indications: payload,
      };
      break;
    case SORT_SUCCESS:
      baseDataInnerState = {
        studies: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_LANDING:
      baseDataInnerState = {
        subscriptionError: null,
        landing: {
          details: null,
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_LANDING_SUCCESS:
      baseDataInnerState = {
        landing: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_LANDING_ERROR:
      baseDataInnerState = {
        landing: {
          details: null,
          fetching: false,
          error: payload,
        },
      };
      break;
    case CLEAR_LANDING:
      baseDataInnerState = {
        subscriptionError: null,
        subscribedFromLanding: null,
        landing: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case CLINICAL_TRIALS_SEARCH:
      baseDataInnerState = {
        trials: {
          details: cloneDeep(state.baseData.trials.details),
          total: state.baseData.trials.total,
          wrongPostalCode: state.baseData.trials.wrongPostalCode,
          fetching: true,
          error: null,
        },
      };
      break;
    case CLINICAL_TRIALS_SEARCH_SUCCESS:
      const trialsCollection = concat(state.baseData.trials.details, payload.data);
      if (trialsCollection && trialsCollection[0] === null) {
        trialsCollection.splice(0, 1);
      }
      baseDataInnerState = {
        trials: {
          details: trialsCollection,
          total: payload.total,
          wrongPostalCode: payload.wrongPostalCode,
          fetching: false,
          error: null,
        },
      };
      break;
    case CLEAR_CLINICAL_TRIALS_SEARCH:
      baseDataInnerState = {
        trials: {
          details: null,
          total: null,
          wrongPostalCode: false,
          fetching: false,
          error: null,
        },
      };
      break;
    case PATIENT_SUBSCRIBED:
      baseDataInnerState = {
        subscribedFromLanding: payload,
      };
      break;
    case FIND_OUT_PATIENTS_POSTED:
      baseDataInnerState = {
        findOutPosted: payload,
      };
      break;
    case LIST_SITE_NOW_SUCCESS:
      baseDataInnerState = {
        listSiteNowSuccess: true,
      };
      break;
    case RESET_LIST_SITE_NOW_SUCCESS:
      baseDataInnerState = {
        listSiteNowSuccess: null,
      };
      break;
    case GET_PROPOSAL_SUCCESS:
      baseDataInnerState = {
        getProposalSuccess: true,
      };
      break;
    case RESET_GET_PROPOSAL_SUCCESS:
      baseDataInnerState = {
        getProposalSuccess: null,
      };
      break;
    case LEARN_ABOUT_FUTURE_TRIALS_SUCCESS:
      baseDataInnerState = {
        learnAboutFutureTrialsSuccess: true,
      };
      break;
    case RESET_LEARN_ABOUT_FUTURE_TRIALS:
      baseDataInnerState = {
        learnAboutFutureTrialsSuccess: null,
      };
      break;
    case NEW_CONTACT_SUCCESS:
      baseDataInnerState = {
        newContactsSuccess: true,
      };
      break;
    case RESET_NEW_CONTACT_SUCCESS:
      baseDataInnerState = {
        newContactsSuccess: null,
      };
      break;
    case PATIENT_SUBSCRIPTION_ERROR:
      baseDataInnerState = {
        subscriptionError: payload,
      };
      break;
    case FETCH_SOURCES_SUCCESS:
      baseDataInnerState = {
        sources: payload,
      };
      break;
    case FETCH_LEVELS_SUCCESS: {
      const levels = payload.map(l => {
        switch (l.name) {
          case 'Ruby':
            return { ...l, price: 5297, posts: 108, texts: 400 };
          case 'Diamond':
            return { ...l, price: 3297, posts: 64, texts: 300 };
          case 'Platinum':
            return { ...l, price: 1797, posts: 32, texts: 200 };
          case 'Gold':
            return { ...l, price: 797, posts: 10, texts: 50 };
          case 'Silver':
            return { ...l, price: 297, posts: 3, texts: 15 };
          case 'Bronze':
            return { ...l, price: 97, posts: 1, texts: 5 };
          default:
            return l;
        }
      });
      baseDataInnerState = {
        levels,
      };
      break;
    }
    case FETCH_COUPON:
      baseDataInnerState = {
        coupon: {
          details: null,
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_COUPON_SUCCESS:
      baseDataInnerState = {
        coupon: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_COUPON_ERROR:
      baseDataInnerState = {
        coupon: {
          details: null,
          fetching: false,
          error: payload,
        },
      };
      break;
    case CLEAR_COUPON:
      baseDataInnerState = {
        coupon: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_REWARDS:
      baseDataInnerState = {
        rewards: [],
      };
      break;
    case FETCH_REWARDS_SUCCESS:
      baseDataInnerState = {
        rewards: payload,
      };
      break;
    case FETCH_REWARDS_ERROR:
      baseDataInnerState = {
        rewards: [],
      };
      break;
    case FETCH_REWARDS_BALANCE_SUCCESS: {
      const { siteId } = action;
      baseDataInnerState = {
        rewardsBalance: {
          ...state.baseData.rewardsBalance,
          [siteId || 0]: payload,
        },
      };
      break;
    }
    case REDEEM_SUCCESS: {
      const { siteId, balance, points } = payload;
      baseDataInnerState = {
        rewardsBalance: {
          ...state.baseData.rewardsBalance,
          [siteId]: balance,
          0: parseInt(state.baseData.rewardsBalance[0]) + parseInt(points),
        },
      };
      break;
    }
    case FETCH_PROTOCOLS:
      baseDataInnerState = {
        protocols: {
          details: [],
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_PROTOCOLS_SUCCESS:
      baseDataInnerState = {
        protocols: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_PROTOCOLS_ERROR:
      baseDataInnerState = {
        protocols: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
      break;
    case FETCH_CARDS:
      baseDataInnerState = {
        cards: {
          details: null,
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_CARDS_SUCCESS:
      baseDataInnerState = {
        cards: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_CARDS_ERROR:
      baseDataInnerState = {
        cards: {
          details: null,
          fetching: false,
          error: payload,
        },
      };
      break;
    case SAVE_CARD:
      baseDataInnerState = {
        savedCard: {
          details: null,
          saving: true,
          error: null,
        },
      };
      break;
    case SAVE_CARD_SUCCESS:
      cardsCollection.data.push(payload);
      baseDataInnerState = {
        cards: {
          details: cardsCollection,
          fetching: false,
          error: null,
        },
        savedCard: {
          details: payload,
          saving: false,
          error: null,
        },
      };
      break;
    case SAVE_CARD_ERROR:
      baseDataInnerState = {
        savedCard: {
          details: null,
          saving: false,
          error: payload,
        },
      };
      break;
    case DELETE_CARD:
      baseDataInnerState = {
        deletedCard: {
          details: null,
          deleting: true,
          error: null,
        },
      };
      break;
    case DELETE_CARD_SUCCESS:
      remove(cardsCollection.data, { id: payload.id });
      baseDataInnerState = {
        cards: {
          details: cardsCollection,
          fetching: false,
          error: null,
        },
        deletedCard: {
          details: payload,
          deleting: false,
          error: null,
        },
      };
      break;
    case DELETE_CARD_ERROR:
      baseDataInnerState = {
        deletedCard: {
          details: null,
          deleting: false,
          error: payload,
        },
      };
      break;
    case ADD_CREDITS:
      baseDataInnerState = {
        addCredits: {
          details: null,
          adding: true,
          error: null,
        },
      };
      break;
    case ADD_CREDITS_SUCCESS:
      cardsCollection.data.push(payload);
      baseDataInnerState = {
        addCredits: {
          details: payload,
          adding: false,
          error: null,
        },
      };
      break;
    case ADD_CREDITS_ERROR:
      baseDataInnerState = {
        addCredits: {
          details: null,
          adding: false,
          error: payload,
        },
      };
      break;
    case FETCH_CLIENT_SITES:
      baseDataInnerState = {
        sites: {
          details: [],
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_SITES_SUCCESS:
      baseDataInnerState = {
        sites: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_SITES_ERROR:
      baseDataInnerState = {
        sites: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
      break;
    case FETCH_SITE_PATIENTS:
      baseDataInnerState = {
        sitePatients: {
          details: state.baseData.sitePatients.details,
          fetching: true,
          error: null,
        },
        globalPMSPaginationOptions: {
          hasMoreItems: false,
          page: state.baseData.globalPMSPaginationOptions.page,
        },
      };
      break;
    case FETCH_SITE_PATIENTS_SUCCESS:
      if (action.page === 1) {
        console.log(1);
        newPatientsList = payload;
      } else {
        console.log(2, patientsCopy);
        newPatientsList = patientsCopy.concat(payload);
      }
      baseDataInnerState = {
        sitePatients: {
          details: newPatientsList,
          fetching: false,
          error: null,
        },
        globalPMSPaginationOptions: {
          hasMoreItems: action.hasMoreItems,
          page: action.page,
        },
      };
      break;
    case FETCH_SITE_PATIENTS_ERROR:
      baseDataInnerState = {
        sitePatients: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
      break;
    case UPDATE_SITE_PATIENTS:
      unreadCount = 0;
      sitePatientsCollection = state.baseData.sitePatients.details.map(item => {
        const patientData = item;
        if (patientData.id === action.newMessage.patient_id && patientData.study_id === action.newMessage.study_id) {
          const countUnread = patientData.count_unread;
          if (countUnread) {
            if (action.newMessage.twilioTextMessage.direction === 'outbound-api') {
              patientData.count_unread = parseInt(countUnread);
            } else {
              patientData.count_unread = parseInt(countUnread) + 1;
              unreadCount = 1;
            }
          } else if (action.newMessage.twilioTextMessage.direction === 'outbound-api') {
            patientData.count_unread = 0;
          } else {
            patientData.count_unread = 1;
            unreadCount = 1;
          }
          patientData.twtm_max_date_created = action.newMessage.twilioTextMessage.dateCreated;
          patientData.last_message_body = action.newMessage.twilioTextMessage.body;
        }
        return patientData;
      });
      sitePatientsCollection = sortBy(sitePatientsCollection, item => item.twtm_max_date_created);
      baseDataInnerState = {
        sitePatients: {
          details: sitePatientsCollection,
          fetching: false,
          error: null,
        },
        patientMessages: {
          details: state.baseData.patientMessages.details,
          fetching: false,
          error: null,
          stats: {
            total: state.baseData.patientMessages.stats.total,
            unreadEmails: state.baseData.patientMessages.stats.unreadEmails,
            unreadTexts: state.baseData.patientMessages.stats.unreadTexts + unreadCount,
          },
        },
      };
      break;
    case MARK_AS_READ_PATIENT_MESSAGES:
      sitePatientsCollection = map(state.baseData.sitePatients.details, item => {
        const patientData = Object.assign({}, item);
        if (patientData.id === action.patientId) {
          unreadCount = patientData.count_unread;
          patientData.count_unread = 0;
        }
        return patientData;
      });
      baseDataInnerState = {
        sitePatients: {
          details: sitePatientsCollection,
          fetching: false,
          error: null,
        },
        patientMessages: {
          details: state.baseData.patientMessages.details,
          fetching: false,
          error: null,
          stats: {
            total: state.baseData.patientMessages.stats.total || 0,
            unreadEmails: state.baseData.patientMessages.stats.unreadEmails || 0,
            unreadTexts: state.baseData.patientMessages.stats.unreadText || 0,
          },
        },
      };
      break;
    case GET_CNS_INFO_SUCCESS:
      baseDataInnerState = {
        cnsInfo: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case SUBMIT_CNS:
      baseDataInnerState = {
        cnsSubmitProcess: {
          submitting: true,
          error: null,
        },
      };
      break;
    case SUBMIT_CNS_SUCCESS:
      baseDataInnerState = {
        cnsSubmitProcess: {
          submitting: false,
          error: null,
        },
      };
      break;
    case SUBMIT_CNS_ERROR:
      baseDataInnerState = {
        cnsSubmitProcess: {
          submitting: false,
          error: payload,
        },
      };
      break;
    case FETCH_CLIENT_CREDITS:
      baseDataInnerState = {
        clientCredits: {
          details: {},
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_CREDITS_SUCCESS:
      baseDataInnerState = {
        clientCredits: {
          details: payload.customerCredits,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_CREDITS_ERROR:
      baseDataInnerState = {
        clientCredits: {
          details: {},
          fetching: false,
          error: payload,
        },
      };
      break;
    case FETCH_PATIENT_MESSAGES:
      baseDataInnerState = {
        patientMessages: {
          ...state.baseData.patientMessages,
          details: [],
          fetching: true,
          error: null,
          stats: {
            total: state.baseData.patientMessages.stats || 0,
            unreadEmails: state.baseData.patientMessages.stats || 0,
            unreadTexts: state.baseData.patientMessages.stats || 0,
          },
        },
      };
      break;
    case FETCH_PATIENT_MESSAGES_SUCCESS:
      baseDataInnerState = {
        patientMessages: {
          ...state.baseData.patientMessages,
          details: payload,
          fetching: false,
          error: null,
          stats: {
            total: state.baseData.patientMessages.stats || 0,
            unreadEmails: state.baseData.patientMessages.stats || 0,
            unreadTexts: state.baseData.patientMessages.stats || 0,
          },
        },
      };


      break;
    case FETCH_PATIENT_MESSAGES_ERROR:
      baseDataInnerState = {
        patientMessages: {
          ...state.baseData.patientMessages,
          details: [],
          fetching: false,
          error: payload,
          stats: {
            unreadText: 0,
            unreadEmails: 0,
            total: 0,
          },
        },
      };
      break;
    case UPDATE_PATIENT_MESSAGES:
      patientMessagesCollection = concat(state.baseData.patientMessages.details, action.newMessage);
      baseDataInnerState = {
        patientMessages: {
          ...state.baseData.patientMessages,
          details: patientMessagesCollection,
          fetching: false,
          error: null,
          stats: {
            total: state.baseData.patientMessages.stats || 0,
            unreadEmails: state.baseData.patientMessages.stats || 0,
            unreadTexts: state.baseData.patientMessages.stats || 0,
          },
        },
      };
      break;
    case FETCH_PATIENT_MESSAGE_UNREAD_COUNT_SUCCESS:
      baseDataInnerState = {
        patientMessages: {
          ...state.baseData.patientMessages,
          stats: {
            total: action.payload.total || 0,
            unreadEmails: action.payload.unreadEmails || 0,
            unreadTexts: action.payload.unreadTexts || 0,
          },
        },
      };
      break;
    case SEARCH_SITE_PATIENTS_SUCCESS:
      sitePatientsCollection = map(state.baseData.sitePatients.details, item => {
        let patientData = null;
        patientData = item;
        patientData.show = false;
        forEach(payload, dataItem => {
          if (dataItem.id === patientData.id && dataItem.study_id === patientData.study_id) {
            patientData.show = true;
          }
        });
        return patientData;
      });
      // return state;
      baseDataInnerState = {
        sitePatients: {
          details: sitePatientsCollection,
          fetching: false,
          error: null,
        },
      };
      break;
    case SEARCH_SITE_PATIENTS_ERROR:
      return state;
    case FETCH_CLIENT_ROLES:
      baseDataInnerState = {
        clientRoles: {
          details: [],
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_ROLES_SUCCESS:
      baseDataInnerState = {
        clientRoles: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_CLIENT_ROLES_ERROR:
      baseDataInnerState = {
        clientRoles: {
          details: [],
          fetching: false,
          error: payload,
        },
      };
      break;
    case FETCH_SITE:
      baseDataInnerState = {
        selectedSite: {
          details: null,
          id: action.id,
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_SITE_SUCCESS:
      baseDataInnerState = {
        selectedSite: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_SITE_ERROR:
      baseDataInnerState = {
        selectedSite: {
          details: null,
          fetching: false,
          error: payload,
        },
      };
      break;
    case FETCH_USER:
      baseDataInnerState = {
        selectedUser: {
          details: null,
          id: action.id,
          fetching: true,
          error: null,
        },
      };
      break;
    case FETCH_USER_SUCCESS:
      baseDataInnerState = {
        selectedUser: {
          details: payload,
          fetching: false,
          error: null,
        },
      };
      break;
    case FETCH_USER_ERROR:
      baseDataInnerState = {
        selectedUser: {
          details: null,
          fetching: false,
          error: payload,
        },
      };
      break;
    case CLEAR_SELECTED_SITE:
      baseDataInnerState = {
        selectedSite: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case CLEAR_SELECTED_USER:
      baseDataInnerState = {
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case DELETE_USER:
      baseDataInnerState = {
        deletedUser: {
          details: null,
          deleting: true,
          error: null,
        },
      };
      break;
    case DELETE_USER_SUCCESS:
      forEach(clientSitesCollection, item => {
        forEach(item.roles, role => {
          if (role.user.id === payload.id) {
            temRoleID = role.id;
            return false;
          }
          return true;
        });
      });
      forEach(clientSitesCollection, item => {
        if (remove(item.roles, { id: temRoleID }).length > 0) {
          return false;
        }
        return true;
      });

      forEach(clientRolesCollection, item => {
        if (item.user.id === payload.id) {
          temRoleID = item.id;
          return false;
        }
        return true;
      });
      remove(clientRolesCollection, { id: temRoleID });

      baseDataInnerState = {
        deletedUser: {
          details: payload,
          deleting: false,
          error: null,
        },
        clientSites: {
          details: clientSitesCollection,
          fetching: false,
          error: null,
        },
        clientRoles: {
          details: clientRolesCollection,
          fetching: false,
          error: null,
        },
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case DELETE_USER_ERROR:
      baseDataInnerState = {
        deletedUser: {
          details: null,
          deleting: false,
          error: payload,
        },
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case DELETE_CLIENT_ROLE:
      baseDataInnerState = {
        deletedClientRole: {
          details: null,
          deleting: true,
          error: null,
        },
      };
      break;

    case DELETE_CLIENT_ROLE_SUCCESS:
      remove(clientRolesCollection, { id: payload.id });
      baseDataInnerState = {
        deletedClientRole: {
          details: payload,
          deleting: false,
          error: null,
        },
        clientRoles: {
          details: clientRolesCollection,
          fetching: false,
          error: null,
        },
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case DELETE_CLIENT_ROLE_ERROR:
      baseDataInnerState = {
        deletedClientRole: {
          details: null,
          deleting: false,
          error: payload,
        },
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case SAVE_SITE:
      baseDataInnerState = {
        savedSite: {
          details: null,
          saving: true,
          error: null,
        },
      };
      break;
    case SAVE_SITE_SUCCESS:
      foundIndex = findIndex(sitesCopy, { id: payload.id });
      if (!payload.roles) {
        payload.roles = [];
      }
      if (foundIndex < 0) {
        sitesCopy.push(payload);
      } else {
        payload.roles = sitesCopy[foundIndex].roles;
        sitesCopy[foundIndex] = payload;
      }
      baseDataInnerState = {
        savedSite: {
          details: payload,
          saving: false,
          error: null,
        },
        sites: {
          details: sitesCopy,
          fetching: false,
          error: null,
        },
        selectedSite: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case SAVE_SITE_ERROR:
      baseDataInnerState = {
        savedSite: {
          details: null,
          saving: false,
          error: payload,
        },
        selectedSite: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case SAVE_USER:
      baseDataInnerState = {
        savedUser: {
          details: null,
          saving: true,
          error: null,
        },
      };
      break;
    case SAVE_USER_SUCCESS:
      if (payload.userType === 'admin') {
        forEach(clientSitesCollection, item => {
          foundIndex = findIndex(item.roles, { id: payload.userResultData.user.id });
          if (foundIndex > -1) {
            item.roles.splice(foundIndex, 1);
            foundIndex = -1;
            return false;
          }
          return true;
        });
      } else if (payload.userType === 'nonAdmin') {
        forEach(clientSitesCollection, item => {
          foundIndex = findIndex(item.roles, { id: payload.userResultData.user.id });
          if (foundIndex > -1) {
            if (item.id === payload.userResultData.siteId) {
              item.roles[foundIndex].user = payload.userResultData.user; // eslint-disable-line
            } else {
              item.roles.splice(foundIndex, 1);
              foundIndex = -1;
            }
            return false;
          }
          return true;
        });
        if (foundIndex < 0) {
          foundIndex = findIndex(clientSitesCollection, { id: payload.userResultData.siteId });
          if (foundIndex > -1) {
            clientSitesCollection[foundIndex].roles.push(payload.userResultData);
          }
        }
      }
      foundIndex = findIndex(clientRolesCollection, (item) => (item.user_id === payload.userResultData.user.id));
      if (payload.userType === 'admin') {
        if (foundIndex < 0) {
          clientRolesCollection.push(payload.userResultData);
        } else {
          clientRolesCollection[foundIndex] = payload.userResultData;
        }
      } else if (payload.userType === 'nonAdmin') {
        if (foundIndex > -1) {
          clientRolesCollection[foundIndex] = payload.userResultData;
        }
      }
      // if (payload.userResultData.header === 'Add User') {
      //   // if (payload.userResultData.siteId && payload.userResultData.siteId !== '0') {
      //   //   foundIndex = findIndex(clientSitesCollection, { id: payload.userResultData.siteId });
      //   //   clientSitesCollection[foundIndex].roles.push(payload.userResultData.user);
      //   // } else {
      //   clientRolesCollection.push(payload.userResultData);
      //   // }
      // }

      baseDataInnerState = {
        savedUser: {
          details: payload,
          saving: false,
          error: null,
        },
        clientSites: {
          details: clientSitesCollection,
          fetching: false,
          error: null,
        },
        clientRoles: {
          details: clientRolesCollection,
          fetching: false,
          error: null,
        },
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case SAVE_USER_ERROR:
      baseDataInnerState = {
        savedUser: {
          details: null,
          saving: false,
          error: payload,
        },
        selectedUser: {
          details: null,
          fetching: false,
          error: null,
        },
      };
      break;
    case GET_CREDITS_PRICE_SUCCESS:
      baseDataInnerState = {
        creditsPrice: payload,
      };
      break;
    case CHANGE_USERS_TIMEZONE:
      baseDataInnerState = {
        changeUsersTimezoneState: {
          saving: true,
        },
      };
      break;
    case CHANGE_USERS_TIMEZONE_SUCCESS:
      baseDataInnerState = {
        changeUsersTimezoneState: {
          saving: false,
        },
      };

      resultState = {
        ...state,
        userData: { ...state.userData, timezone: payload },
        baseData: {
          ...state.baseData,
          ...baseDataInnerState,
        },
      };
      break;
    case CHANGE_USERS_TIMEZONE_ERROR:
      baseDataInnerState = {
        changeUsersTimezoneState: {
          saving: false,
        },
      };
      break;
    default:
      return state;
  }

  if (!resultState) {
    resultState = {
      ...state,
      baseData: {
        ...state.baseData,
        ...baseDataInnerState,
      },
    };
  }

  return resultState;
}
