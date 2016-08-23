import React, { PropTypes as pt } from 'react';
import Video from 'react-html5video';
// import Picture from 'components/Picture';
/* eslint-disable camelcase */
const VideoPost = ({
  post: {
    video_url,
    thumbnail_url
  } }) => (
  <Video
    controls
    loop
    poster={thumbnail_url}
    style={{
      width: '100%'
    }}
  >
    <source src={video_url} type="video/mp4" />
  </Video>
);
/* eslint-enable camelcase */
VideoPost.propTypes = {
  post: pt.object.isRequired
};

export default VideoPost;
