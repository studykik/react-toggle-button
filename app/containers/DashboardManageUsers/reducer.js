/*
 *
 * DashboardManageUsers reducer
 *
 */

import _ from 'lodash';

import {
  FETCH_ADMINS,
  FETCH_ADMINS_SUCCESS,
  FETCH_ADMINS_ERROR,
  FETCH_ADMIN_ROLES,
  FETCH_ADMIN_ROLES_SUCCESS,
  FETCH_ADMIN_ROLES_ERROR,
  EDIT_DASHBOARD_USER,
  EDIT_DASHBOARD_USER_SUCCESS,
  EDIT_DASHBOARD_USER_ERROR,
  DELETE_DASHBOARD_USER,
  DELETE_DASHBOARD_USER_SUCCESS,
  DELETE_DASHBOARD_USER_ERROR,
  SET_ACTIVE_SORT,
  SET_SEARCH_QUERY,
} from './constants';

const initialState = {
  admins: {
    details: [],
    fetching: false,
    error: null,
  },
  roles: {
    details: [],
    fetching: false,
    error: null,
  },
  editUserProcess: {
    saving: false,
    deleting: false,
    error: null,
  },
  paginationOptions: {
    activeSort: null,
    activeDirection: null,
    hasMoreItems: false,
    page: 1,
    query: null,
  },
};

function dashboardManageUsersReducer(state = initialState, action) {
  const newAdmins = _.cloneDeep(state.admins.details);
  let foundUserIndex = null;
  let newAdminList = [];


  switch (action.type) {
    case FETCH_ADMINS:
      return {
        ...state,
        admins: {
          details: state.admins.details,
          fetching: true,
          error: null,
        },
      };
    case FETCH_ADMINS_SUCCESS:
      if (action.page === 1) {
        newAdminList = action.payload;
      } else {
        newAdminList = newAdmins.concat(action.payload);
      }

      return {
        ...state,
        admins: {
          details: newAdminList,
          fetching: false,
          error: null,
        },
        paginationOptions: {
          query: state.paginationOptions.query,
          activeSort: state.paginationOptions.activeSort,
          activeDirection: state.paginationOptions.activeDirection,
          hasMoreItems: action.hasMoreItems,
          page: action.page,
        },

      };
    case FETCH_ADMINS_ERROR:
      return {
        ...state,
        admins: {
          details: [],
          fetching: false,
          error: action.payload,
        },
      };
    case FETCH_ADMIN_ROLES:
      return {
        ...state,
        roles: {
          details: [],
          fetching: true,
          error: null,
        },
      };
    case FETCH_ADMIN_ROLES_SUCCESS:
      return {
        ...state,
        roles: {
          details: action.payload,
          fetching: false,
          error: null,
        },
      };
    case FETCH_ADMIN_ROLES_ERROR:
      return {
        ...state,
        roles: {
          details: [],
          fetching: false,
          error: action.payload,
        },
      };
    case EDIT_DASHBOARD_USER:
      return {
        ...state,
        editUserProcess: {
          saving: true,
          deleting: false,
          error: null,
        },
      };
    case EDIT_DASHBOARD_USER_SUCCESS:
      foundUserIndex = _.findIndex(newAdmins, item => (item.user_id === action.payload.user_id));
      if (foundUserIndex !== -1) {
        newAdmins.splice(foundUserIndex, 1, action.payload);
      } else {
        newAdmins.push(action.payload);
      }
      return {
        ...state,
        admins: {
          details: newAdmins,
          fetching: false,
          error: null,
        },
        editUserProcess: {
          saving: false,
          deleting: false,
          error: null,
        },
      };
    case EDIT_DASHBOARD_USER_ERROR:
      return {
        ...state,
        editUserProcess: {
          saving: false,
          deleting: false,
          error: action.payload,
        },
      };
    case DELETE_DASHBOARD_USER:
      return {
        ...state,
        editUserProcess: {
          saving: false,
          deleting: true,
          error: null,
        },
      };
    case DELETE_DASHBOARD_USER_SUCCESS:
      foundUserIndex = _.findIndex(newAdmins, item => (item.user_id === action.payload.user_id));
      if (foundUserIndex !== -1) {
        newAdmins.splice(foundUserIndex, 1);
      }
      return {
        ...state,
        admins: {
          details: newAdmins,
          fetching: false,
          error: null,
        },
        editUserProcess: {
          saving: false,
          deleting: false,
          error: null,
        },
      };
    case DELETE_DASHBOARD_USER_ERROR:
      return {
        ...state,
        editUserProcess: {
          saving: false,
          deleting: false,
          error: action.payload,
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
    case SET_SEARCH_QUERY:
      return {
        ...state,
        paginationOptions: {
          activeSort: null,
          activeDirection: null,
          hasMoreItems: false,
          page: 1,
          query: action.query,
        },
      };
    default:
      return state;
  }
}

export default dashboardManageUsersReducer;
