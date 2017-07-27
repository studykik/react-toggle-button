/*
 *
 * DashboardSponsorAdminPage reducer
 *
 */
import _ from 'lodash';
import {
  FETCH_SPONSORS,
  FETCH_SPONSORS_SUCCESS,
  FETCH_SPONSORS_ERROR,
  FETCH_SPONSORS_WITHOUT_ADMIN,
  FETCH_SPONSORS_WITHOUT_ADMIN_SUCCESS,
  FETCH_SPONSORS_WITHOUT_ADMIN_ERROR,
  FETCH_USERS_BY_ROLES,
  FETCH_USERS_BY_ROLES_SUCCESS,
  FETCH_USERS_BY_ROLES_ERROR,
  ADD_SPONSOR_ADMIN,
  ADD_SPONSOR_ADMIN_SUCCESS,
  ADD_SPONSOR_ADMIN_ERROR,
  DELETE_SPONSOR_ADMIN,
  DELETE_SPONSOR_ADMIN_SUCCESS,
  DELETE_SPONSOR_ADMIN_ERROR,
  SET_ACTIVE_SORT,
  SET_SEARCH_QUERY,
} from './constants';

const initialState = {
  sponsors: {
    details: [],
    fetching: false,
    error: null,
  },
  sponsorsWithoutAdmin: {
    details: [],
    fetching: false,
    error: null,
  },
  usersByRoles: {
    details: {},
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

function dashboardSponsorAdminPageReducer(state = initialState, action) {
  const sponsors = _.cloneDeep(state.sponsors.details);
  let newSponsorList = [];

  switch (action.type) {
    case FETCH_SPONSORS:
      return {
        ...state,
        sponsors: {
          details: state.sponsors.details,
          fetching: true,
          error: null,
        },
      };
    case FETCH_SPONSORS_SUCCESS:
      if (action.page === 1) {
        newSponsorList = action.payload;
      } else {
        newSponsorList = sponsors.concat(action.payload);
      }

      return {
        ...state,
        sponsors: {
          details: newSponsorList,
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
    case FETCH_SPONSORS_ERROR:
      return {
        ...state,
        sponsors: {
          details: [],
          fetching: false,
          error: action.payload,
        },
      };
    case FETCH_SPONSORS_WITHOUT_ADMIN:
      return {
        ...state,
        sponsorsWithoutAdmin: {
          details: [],
          fetching: true,
          error: null,
        },
      };
    case FETCH_SPONSORS_WITHOUT_ADMIN_SUCCESS:
      return {
        ...state,
        sponsorsWithoutAdmin: {
          details: action.payload,
          fetching: false,
          error: null,
        },
      };
    case FETCH_SPONSORS_WITHOUT_ADMIN_ERROR:
      return {
        ...state,
        sponsorsWithoutAdmin: {
          details: [],
          fetching: false,
          error: action.payload,
        },
      };
    case FETCH_USERS_BY_ROLES:
      return {
        ...state,
        usersByRoles: {
          details: {},
          fetching: true,
          error: null,
        },
      };
    case FETCH_USERS_BY_ROLES_SUCCESS:
      return {
        ...state,
        usersByRoles: {
          details: action.payload,
          fetching: false,
          error: null,
        },
      };
    case FETCH_USERS_BY_ROLES_ERROR:
      return {
        ...state,
        usersByRoles: {
          details: {},
          fetching: false,
          error: action.payload,
        },
      };
    case ADD_SPONSOR_ADMIN:
      return {
        ...state,
        editUserProcess: {
          saving: true,
          deleting: false,
          error: null,
        },
      };
    case ADD_SPONSOR_ADMIN_SUCCESS:
      return {
        ...state,
        editUserProcess: {
          saving: false,
          deleting: false,
          error: null,
        },
      };
    case ADD_SPONSOR_ADMIN_ERROR:
      return {
        ...state,
        editUserProcess: {
          saving: false,
          deleting: false,
          error: action.payload,
        },
      };
    case DELETE_SPONSOR_ADMIN:
      return {
        ...state,
        editUserProcess: {
          saving: false,
          deleting: true,
          error: null,
        },
      };
    case DELETE_SPONSOR_ADMIN_SUCCESS:
      return {
        ...state,
        editUserProcess: {
          saving: false,
          deleting: false,
          error: null,
        },
      };
    case DELETE_SPONSOR_ADMIN_ERROR:
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

export default dashboardSponsorAdminPageReducer;
