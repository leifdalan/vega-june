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
  formatDate = date => {
    let formattedDate = null;
    try {
      formattedDate = fecha.format(new Date(date), 'MMM DD');
    } catch(e) {
      console.error(e);
    }
    return formattedDate;
  }
  render() {
    const {
      formatDate,
      props: {
        containerWidth,
        post: {
          date,
          id,
          isPortrait,
          thumbnails,
          description
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
              ? containerWidth * 16 / 9
              : containerWidth * 9 / 16
          }}
        >
          <iframe
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              marginBottom: 15
            }}
            allowFullScreen
            frameBorder="0"
            width={'100%'}
            height="100%"
            src={`//www.youtube.com/embed/${id}`}
          />
        </div>
        <figcaption>
          <div style={DATE_STYLE}>
            <div>
              {formatDate(date)}
            </div>
          </div>
          {description && description}
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
