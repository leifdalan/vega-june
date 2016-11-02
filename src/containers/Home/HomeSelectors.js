import { createSelector } from 'reselect';
import { userSelector } from 'redux/modules/auth';
import { PropTypes as pt } from 'react';
import fMap from 'lodash/fp/map';
import fOrderBy from 'lodash/fp/orderBy';
import fFilter from 'lodash/fp/filter';
import flow from 'lodash/flow';
import map from 'lodash/map';
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
  ) => flow(
    fFilter(({ type }) => type !== 'video'), // filter tumblr type: video
    fOrderBy('date', 'desc') // order by date
  )([...map(tumblr), ...map(youtube)]) // map array-like object to array and mix the two as an imput

);

export const getImageRatiosSelector = createSelector(
  getAllPostsByDateSelector,
  /* eslint-disable */
  fMap(post => post.type === 'photo'
    ? post.photos[0].original_size.height / post.photos[0].original_size.width
    // its a video post
    : post.isPortrait ? (16 / 9) : (9 / 16)
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
