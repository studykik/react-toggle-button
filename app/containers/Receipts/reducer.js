/*
 *
 * Receipts reducer
 *
 */

import {
  DEFAULT_ACTION,
  RECEIPTS_RECEIVED,
  GET_RECEIPTS,
  SET_SEARCH_OPTIONS,
  SET_ACTIVE_SORT,
  SORT_PROPOSALS_SUCCESS,
} from './constants';

const initialState = {
  receiptsFetching: false,
  receiptsList: [],
  paginationOptions: {
    hasMoreItems: true,
    page: 1,
    activeSort: null,
    activeDirection: null,
  },
  searchOptions: [],
};

function receiptsReducer(state = initialState, action) {
  switch (action.type) {
    case DEFAULT_ACTION:
      return state;
    case GET_RECEIPTS:
      return {
        ...state,
        receiptsFetching: true,
        paginationOptions:{
          hasMoreItems: false,
          page: state.paginationOptions.page,
          activeSort: state.paginationOptions.activeSort,
          activeDirection: state.paginationOptions.activeDirection,
        },
      };
    case RECEIPTS_RECEIVED:
      return {
        ...state,
        receiptsFetching: false,
        receiptsList: action.payload,
        paginationOptions: {
          hasMoreItems: action.hasMore,
          page: action.page,
          activeSort: state.paginationOptions.activeSort,
          activeDirection: state.paginationOptions.activeDirection,
        },
      };
    case SET_SEARCH_OPTIONS:
      return {
        ...state,
        searchOptions: action.payload,
      };
    case SET_ACTIVE_SORT:
      return {
        ...state,
        paginationOptions: {
          activeSort: action.sort,
          activeDirection: action.direction,
          hasMoreItems: state.paginationOptions.hasMoreItems,
          page: state.paginationOptions.page,
        },
      };
    case SORT_PROPOSALS_SUCCESS:
      return {
        ...state,
        receiptsList: action.payload,
      };
    default:
      return state;
  }
}

export default receiptsReducer;
