import { createSelector } from 'reselect';
import {
  LOAD_ALL_SUCCESS,
} from './tumblr';
import get from 'lodash/get';
import find from 'lodash/find';
import fOrderBy from 'lodash/fp/orderBy';
const initialState = {
  pageInfo: {},
  data: {}
};

export default function youtube(state = initialState, action) {
  switch (action.type) {
    case LOAD_ALL_SUCCESS:
      const result = action.result.youtube;
      return {
        ...state,
        pageInfo: result.pageInfo,
        data: {
          ...state.data,
          ...result.items.reduce((out, item) => ({
            ...out,
            [item.id]: {
              type: 'youtube',
              id: item.id,
              title: item.snippet.title,
              description: item.snippet.description,
              thumbnails: item.snippet.thumbnails,
              tags: item.snippet.tags,
              isPortrait: !!find(item.snippet.tags, tag => tag === 'portrait'),
              date: `${item.snippet.title.substring(4, 8)}-` +
                `${item.snippet.title.substring(8, 10)}-` +
                `${item.snippet.title.substring(10, 12)} ` +
                `${item.snippet.title.substring(13, 15)}:` +
                `${item.snippet.title.substring(15, 17)}:` +
                `${item.snippet.title.substring(17, 19)} GMT`
            }
          }), {}),
        }
      };
    default:
      return state;
  }
}

export const getDataSelector = createSelector(
  state => get(state, 'youtube.data'),
  data => data
);

export const getPostsByDateSelector = createSelector(
  getDataSelector,
  fOrderBy('date', 'desc')
);
