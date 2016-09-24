import { createSelector } from 'reselect';
import {
  getPhotoPostsByDateSelector,
  getPostsByTagSelector,
  getTagsSelector,
  getDataSelector,
  getPostsByMonthSelector,
} from 'redux/modules/info';
import {
  getBrowserDimensionSelector,
  getBrowserHeightSelector,
  getTouchSelector,
} from 'redux/modules/browser';

export const mapStateToProps = createSelector(
  getPhotoPostsByDateSelector,
  getPostsByTagSelector,
  getTagsSelector,
  getDataSelector,
  getBrowserDimensionSelector,
  getBrowserHeightSelector,
  getPostsByMonthSelector,
  state => state.routing.locationBeforeTransitions,
  getTouchSelector, (
    posts,
    postsByTag,
    tags,
    postsById,
    browserWidth,
    browserHeight,
    postsByMonth,
    location,
    hasTouch,
  ) => ({
    posts,
    postsByTag,
    tags,
    postsById,
    browserWidth,
    browserHeight,
    postsByMonth,
    location,
    hasTouch,
  })
);
