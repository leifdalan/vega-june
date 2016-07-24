import { createSelector } from 'reselect';
import {
  getPostsByDateSelector,
  getPostsByTagSelector,
  getTagsSelector,
  getDataSelector,
} from 'redux/modules/info';

export const mapStateToProps = createSelector(
  getPostsByDateSelector,
  getPostsByTagSelector,
  getTagsSelector,
  getDataSelector, (
    posts,
    postsByTag,
    tags,
    postsById
  ) => ({
    posts,
    postsByTag,
    tags,
    postsById
  })
);
