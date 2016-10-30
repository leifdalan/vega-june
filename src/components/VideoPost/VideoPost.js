import React, { PropTypes as pt } from 'react';
import Video from 'react-html5video';
import {
  POST_CONTAINER,
  PICTURE_STYLE,
} from 'components/Post/Post.styles'
// import Picture from 'components/Picture';
/* eslint-disable camelcase */
const VideoPost = ({
  containerWidth,
  post: {
    id,
    isPortrait,
    thumbnails,

  } }) => (
  <div
    style={{
      ...POST_CONTAINER,
      width: '100%',
      position: 'relative',
      paddingBottom: isPortrait
        ? containerWidth * 4 / 3
        : containerWidth * 3 / 4
    }}
  >
    <iframe
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
      }}
      width={'100%'}
      height="100%"
      src={`//www.youtube.com/embed/${id}`}
    />
  </div>
);
/* eslint-enable camelcase */
VideoPost.propTypes = {
  post: pt.object.isRequired
};

export default VideoPost;
