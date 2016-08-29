import React, { PropTypes as pt } from 'react';
import Video from 'react-html5video';
import {
  POST_CONTAINER,
  PICTURE_STYLE,
} from 'components/Post/Post.styles'
// import Picture from 'components/Picture';
/* eslint-disable camelcase */
const VideoPost = ({
  post: {
    video_url,
    thumbnail_url
  } }) => (
  <div
    style={{
      ...POST_CONTAINER,
      width: '100%'
    }}
  >
    <Video
      controls
      loop
      poster={thumbnail_url}
      style={{
        width: '100%',
      }}
      >
      <source src={video_url} type="video/mp4" />
    </Video>
  </div>
);
/* eslint-enable camelcase */
VideoPost.propTypes = {
  post: pt.object.isRequired
};

export default VideoPost;
