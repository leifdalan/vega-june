import { createSelector } from 'reselect';
import {
  getPhotoPostsByDateSelector,
  getPostsByTagSelector,
  getTagsSelector,
  getDataSelector,
  getPostsByMonthSelector,
} from 'redux/modules/info';
import {
  getBrowserDimensionSelector
} from 'redux/modules/browser';

export const mapStateToProps = createSelector(
  getPhotoPostsByDateSelector,
  getPostsByTagSelector,
  getTagsSelector,
  getDataSelector,
  getBrowserDimensionSelector,
  getPostsByMonthSelector,
  state => state.routing.locationBeforeTransitions, (
    posts,
    postsByTag,
    tags,
    postsById,
    browserWidth,
    postsByMonth,
    location,
  ) => ({
    posts,
    postsByTag,
    tags,
    postsById,
    browserWidth,
    postsByMonth,
    location,
  })
);
