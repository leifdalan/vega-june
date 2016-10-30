import { createSelector } from 'reselect';
import { PropTypes as pt } from 'react';
import {
  getContainerWidthSelector,
} from 'redux/modules/browser';
import {
  loadRemaining
} from 'redux/modules/tumblr';
import {
  getPostsByDateSelector as getYoutubeByDateSelector
} from 'redux/modules/youtube';

export const mapStateToProps = createSelector(
  getYoutubeByDateSelector,
  getContainerWidthSelector, (
    videos,
    containerWidth
  ) => ({
    videos,
    containerWidth
  })
);

export const actions = {
  loadRemaining,
};

export const propTypes = {
  children: pt.any,
  videos: pt.obj,
  containerWidth: pt.number
};
