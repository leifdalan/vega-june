import { createSelector } from 'reselect';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import get from 'lodash/get';
import fOrderBy from 'lodash/fp/orderBy';
import fMap from 'lodash/fp/map';
import fKeys from 'lodash/fp/keys';
import max from 'lodash/max';
import reduce from 'lodash/reduce';
import last from 'lodash/last';
export const LOAD = 'redux-example/LOAD';
export const LOAD_SUCCESS = 'redux-example/LOAD_SUCCESS';
export const LOAD_FAIL = 'redux-example/LOAD_FAIL';
export const LOAD_ALL = 'redux-example/LOAD_ALL';
export const LOAD_ALL_SUCCESS = 'redux-example/LOAD_ALL_SUCCESS';
export const LOAD_ALL_FAIL = 'redux-example/LOAD_ALL_FAIL';


const initialState = {
  loading: false,
  loaded: false,
  pages: {},
  data: {},
  blog: {}
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
        },
        blog: {
          ...state.blog,
          ...action.result.blog,
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
    case LOAD_ALL_SUCCESS:
      return {
        ...state,
        loading: false,
        pages: reduce(action.result, (out, page, index) => ({
          ...out,
          [index]: map(page.posts, 'id')
        }), state.pages),
        data: {
          ...state.data,
          ...reduce(action.result, (out, page) => ({
            ...out,
            ...keyBy(page.posts, 'id')
          }), state.data)
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
      return;
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

export const getAllThumbnails = createSelector(
  getDataSelector,
  data => reduce(data, (out, post) => [
    ...out,
    ...reduce(post.photos, (photosOut, photo) => [
      ...photosOut,
      last(photo.alt_sizes).url
    ], [])
  ], [])
);

export const getLoadingSelector = createSelector(
  state => state.info.loading,
  loading => loading
);

export const getImageRatiosSelector = createSelector(
  getPostsByDateSelector,
  fMap(post => post.photos[0].original_size.height / post.photos[0].original_size.width)
);

export const getPostsByTagSelector = createSelector(
  getPostsByDateSelector,
  posts => posts.reduce((out, post) => ({
    ...out,
    ...post.tags.reduce((tagOut, tag) => ({
      ...tagOut,
      [tag]: (out[tag] ? out[tag] : []).concat(post.id)
    }), {})
  }), {})
);

export const getTagsSelector = createSelector(
  getPostsByTagSelector,
  fKeys
);

export function loadRemaining() {
  return (dispatch, getState) => {
    const state = getState();
    const pages = Object.keys(getPagesSelector(state));
    const data = getDataSelector(state);
    const totalPosts = state.info.blog.total_posts;
    console.error('state.info', state.info);
    console.error('pages', pages);
    console.error('data', data);
    console.error('totalPosts % 20', totalPosts % 20);
    if (pages.length === totalPosts % 20 - 1) return;
    return dispatch({
      types: [
        LOAD_ALL,
        LOAD_ALL_SUCCESS,
        LOAD_ALL_FAIL,
      ],
      promise: client => client.get('/loadAll/', {
        params: {
          pages: pages.join(','),
          totalPosts
        }
      })
    });
  };
}

export const preloadImages = imageSrcs => dispatch => {
  dispatch({
    type: 'START_LOADING',
    payload: imageSrcs.length
  });
  return Promise.all(imageSrcs.map((imgSrc) =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.src = imgSrc;
      image.onload = img => {
        dispatch({
          type: 'TICK_LOADING'
        });
        resolve(img);
      };
      image.onerror = err => reject(err);
    })
  )).then(() => {
    dispatch({
      type: 'RESET_LOADING'
    });
  }, () => {
    dispatch({
      type: 'RESET_LOADING'
    });
  });
};
