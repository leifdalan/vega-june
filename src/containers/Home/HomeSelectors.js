import { createSelector } from 'reselect';
import { userSelector } from 'redux/modules/auth';
import { PropTypes as pt } from 'react';
import orderBy from 'lodash/orderBy';
import omitBy from 'lodash/omitBy';
import fMap from 'lodash/fp/map';
import {
  getNextPageSelector,
  getPostsByDateSelector,
  getPagesSelector,
  getDataSelector,
  getLoadingSelector,
  load as loadInfo,
  loadRemaining,
} from 'redux/modules/tumblr';
import {
  getPostsByDateSelector as getYoutubeByDateSelector
} from 'redux/modules/youtube';

import {
  getDistanceFromBottomSelector,
  getContainerWidthSelector,
  setWindow,
  setContainerWidth,
} from 'redux/modules/browser';

const getAllPostsByDateSelector = createSelector(
  getPostsByDateSelector,
  getYoutubeByDateSelector, (
    tumblr,
    youtube,
  ) => orderBy(omitBy({
    ...tumblr,
    ...youtube,
  }, ({ type }) => type === 'video'), 'date', 'desc')
);

export const getImageRatiosSelector = createSelector(
  getAllPostsByDateSelector,
  /* eslint-disable */
  fMap(post => post.type === 'photo'
    ? post.photos[0].original_size.height / post.photos[0].original_size.width
    // its a video post
    : post.isPortrait ? (4 / 3) : (3 / 4)
  )
  /* eslint-enable */
);


export const mapStateToProps = createSelector(
  getPostsByDateSelector,
  getNextPageSelector,
  getImageRatiosSelector,
  getDataSelector,
  getPagesSelector,
  userSelector,
  getDistanceFromBottomSelector,
  getLoadingSelector,
  getContainerWidthSelector,
  getAllPostsByDateSelector, (
    posts,
    nextPage,
    imageRatios,
    data,
    pages,
    user,
    distanceFromBottom,
    isLoading,
    containerWidth,
    allPosts,
  ) => ({
    posts,
    nextPage,
    imageRatios,
    data,
    pages,
    user,
    distanceFromBottom,
    isLoading,
    containerWidth,
    allPosts,
  })
);

export const actions = {
  loadRemaining,
  setWindow,
  setContainerWidth
};

export const propTypes = {
  posts: pt.array.isRequired,
  data: pt.object.isRequired,
  pages: pt.object.isRequired,
  imageRatios: pt.array.isRequired,
  nextPage: pt.number.isRequired,
  loadInfo: pt.func.isRequired,
  setWindow: pt.func.isRequired,
  setContainerWidth: pt.func.isRequired,
  user: pt.object,
  distanceFromBottom: pt.number,
  isLoading: pt.bool,
  containerWidth: pt.number,
  children: pt.any
};
