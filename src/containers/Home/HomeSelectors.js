import { createSelector } from 'reselect';
import { userSelector } from 'redux/modules/auth';
import { PropTypes as pt } from 'react';
import {
  getNextPageSelector,
  getPostsByDateSelector,
  getImageRatiosSelector,
  getPagesSelector,
  getDataSelector,
  getLoadingSelector,
  load as loadInfo,
} from 'redux/modules/info';
import {
  getDistanceFromBottomSelector,
  getContainerWidthSelector,
  setWindow,
  setContainerWidth,
} from 'redux/modules/browser';

export const mapStateToProps = createSelector(
  getPostsByDateSelector,
  getNextPageSelector,
  getImageRatiosSelector,
  getDataSelector,
  getPagesSelector,
  userSelector,
  getDistanceFromBottomSelector,
  getLoadingSelector,
  getContainerWidthSelector, (
    posts,
    nextPage,
    imageRatios,
    data,
    pages,
    user,
    distanceFromBottom,
    isLoading,
    containerWidth,
  ) => ({
    posts,
    nextPage,
    imageRatios,
    data,
    pages,
    user,
    distanceFromBottom,
    isLoading,
    containerWidth
  })
);

export const actions = {
  loadInfo,
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
}
