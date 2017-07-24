/*
 *
 * DashboardSponsorPage reducer
 *
 */

import _ from 'lodash';

import {
  FETCH_SPONSORS,
  FETCH_SPONSORS_SUCCESS,
  FETCH_SPONSORS_ERROR,
  ADD_SPONSOR,
  ADD_SPONSOR_SUCCESS,
  ADD_SPONSOR_ERROR,
  EDIT_SPONSOR,
  EDIT_SPONSOR_SUCCESS,
  EDIT_SPONSOR_ERROR,
  DELETE_SPONSOR,
  DELETE_SPONSOR_SUCCESS,
  DELETE_SPONSOR_ERROR,
  SET_ACTIVE_SORT,
  SET_SEARCH_QUERY,
} from './constants';

const initialState = {
  sponsors: {
    details: [],
    fetching: false,
    error: null,
  },
  editSponsorProcess: {
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

function dashboardSponsorPageReducer(state = initialState, action) {
  const newSponsors = _.cloneDeep(state.sponsors.details);
  let foundUserIndex = null;
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
        newSponsorList = newSponsors.concat(action.payload);
      }

      return {
        ...state,
        sponsors: {
          details: newSponsorList,
          fetching: false,
          error: null,
        },
        paginationOptions: {
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
    case ADD_SPONSOR:
      return {
        ...state,
        editSponsorProcess: {
          saving: true,
          deleting: false,
          error: null,
        },
      };
    case ADD_SPONSOR_SUCCESS:
      newSponsors.push(action.payload);
      return {
        ...state,
        sponsors: {
          details: newSponsors,
          fetching: false,
          error: action.payload,
        },
        editSponsorProcess: {
          saving: false,
          deleting: false,
          error: null,
        },
      };
    case ADD_SPONSOR_ERROR:
      return {
        ...state,
        editSponsorProcess: {
          saving: false,
          deleting: false,
          error: action.payload,
        },
      };
    case EDIT_SPONSOR:
      return {
        ...state,
        editSponsorProcess: {
          saving: true,
          deleting: false,
          error: null,
        },
      };
    case EDIT_SPONSOR_SUCCESS:
      foundUserIndex = _.findIndex(newSponsors, item => (item.id === action.payload.id));
      if (foundUserIndex !== -1) {
        newSponsors.splice(foundUserIndex, 1, action.payload);
      }
      return {
        ...state,
        sponsors: {
          details: newSponsors,
          fetching: false,
          error: action.payload,
        },
        editSponsorProcess: {
          saving: false,
          deleting: false,
          error: null,
        },
      };
    case EDIT_SPONSOR_ERROR:
      return {
        ...state,
        editSponsorProcess: {
          saving: false,
          deleting: false,
          error: action.payload,
        },
      };
    case DELETE_SPONSOR:
      return {
        ...state,
        editSponsorProcess: {
          saving: false,
          deleting: true,
          error: null,
        },
      };
    case DELETE_SPONSOR_SUCCESS:
      foundUserIndex = _.findIndex(newSponsors, item => (item.id === action.payload.id));
      if (foundUserIndex !== -1) {
        newSponsors.splice(foundUserIndex, 1);
      }
      return {
        ...state,
        sponsors: {
          details: newSponsors,
          fetching: false,
          error: action.payload,
        },
        editSponsorProcess: {
          saving: false,
          deleting: false,
          error: null,
        },
      };
    case DELETE_SPONSOR_ERROR:
      return {
        ...state,
        editSponsorProcess: {
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

export default dashboardSponsorPageReducer;
