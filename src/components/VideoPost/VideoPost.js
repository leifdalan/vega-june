import React, {
  PropTypes as pt,
  Component,
} from 'react';
import {
  DATE_STYLE,
  POST_CONTAINER,
 } from '../../components/Post/Post.styles';
import fecha from 'fecha';

// import Picture from 'components/Picture';
/* eslint-disable camelcase */
class VideoPost extends Component {
  render() {
    const {
      props: {
        containerWidth,
        post: {
          date,
          id,
          isPortrait,
          thumbnails,
        }
      }
    } = this;
    return (
      <div style={POST_CONTAINER}>
        <div
          style={{
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
        <figcaption>
          <div style={DATE_STYLE}>
            <div>
              {fecha.format(new Date(date), 'MMM DD')}
            </div>
          </div>

        </figcaption>
      </div>
    );
  }
}
/* eslint-enable camelcase */
VideoPost.propTypes = {
  post: pt.object.isRequired
};

export default VideoPost;
