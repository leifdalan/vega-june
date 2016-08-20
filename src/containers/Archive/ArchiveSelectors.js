import { createSelector } from 'reselect';
import {
  getPhotoPostsByDateSelector,
  getPostsByTagSelector,
  getTagsSelector,
  getDataSelector,
} from 'redux/modules/info';
import {
  getBrowserDimensionSelector
} from 'redux/modules/browser';

export const mapStateToProps = createSelector(
  getPhotoPostsByDateSelector,
  getPostsByTagSelector,
  getTagsSelector,
  getDataSelector,
  getBrowserDimensionSelector, (
    posts,
    postsByTag,
    tags,
    postsById,
    browserWidth
  ) => ({
    posts,
    postsByTag,
    tags,
    postsById,
    browserWidth
  })
);
