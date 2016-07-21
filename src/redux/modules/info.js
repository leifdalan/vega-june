import { createSelector } from 'reselect';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import get from 'lodash/get';
import fOrderBy from 'lodash/fp/orderBy';
import fMap from 'lodash/fp/map';
import max from 'lodash/max';
const LOAD = 'redux-example/LOAD';
const LOAD_SUCCESS = 'redux-example/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/LOAD_FAIL';


const initialState = {
  loading: false,
  loaded: false,
  pages: {},
  data: {},
};

export default function info(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        pages: {
          ...state.pages,
          [action.page]: {
            loading: true,
            loaded: false,
          }
        }
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        pages: {
          ...state.pages,
          [action.page]: {
            loading: false,
            data: map(action.result.posts, 'id'),
            loaded: true,
          }
        },
        data: {
          ...state.data,
          ...keyBy(action.result.posts, 'id')
        }
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        pages: {
          ...state.pages,
          [action.page]: {
            loading: false,
            loaded: false,
            data: undefined,
          }
        }
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.info && globalState.info.loaded;
}

export function load(offset = 0) {
  return (dispatch, getState) => {
    if (getState().info.pages[offset] || offset > 6) {
      return {
        type: 'NOOP'
      };
    }
    return dispatch({
      types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
      promise: client => client.get('/loadInfo/', {
        params: { offset }
      }),
      page: offset,
    });
  };
}

export const getDataSelector = createSelector(
  state => get(state, 'info.data'),
  data => data
);
export const getPagesSelector = createSelector(
  state => get(state, 'info.pages'),
  data => data
);

export const getPostsByDateSelector = createSelector(
  getDataSelector,
  fOrderBy('date', 'desc')
);
export const getNextPageSelector = createSelector(
  getPagesSelector,
  pages => {
    const keys = Object.keys(pages);
    const numbers = keys.map(key => parseInt(key, 10));
    const nextPage = max(numbers) + 1;
    return nextPage;
  }
);

export const getLoadingSelector = createSelector(
  state => state.info.loading, loading => loading
);

export const getImageRatiosSelector = createSelector(
  getPostsByDateSelector,
  fMap(post => post.photos[0].original_size.height / post.photos[0].original_size.width)
);
