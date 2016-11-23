import React, { PropTypes as pt } from 'react';
import { Link } from 'react-router';
import { Picture } from 'components';
import radium from 'radium';
import {
  POST_CONTAINER,
  DATE_STYLE,
  PICTURE_STYLE,
  MID_BORDER,
  BOTTOM_BORDER
} from './Post.styles';
import {
  FLEX,
  POS_REL
} from 'helpers/radium';
import fecha from 'fecha';

const formatDate = date => {
  let formattedDate = null;
  try {
    formattedDate = fecha.format(new Date(date), 'MMM DD');
  } catch(e) {
    console.error(e);
  }
  return formattedDate;
}


const Post = ({ post, containerWidth, imageRatio, index }) => (
  <div
    key={post.id}
    style={POST_CONTAINER}
  >
    {post.photos.length === 1 &&
      <Link key={index} to={`/gallery/${post.id}`}>
        <Picture
          src={post.photos[0].alt_sizes[1].url}
          ratio={imageRatio}
          style={PICTURE_STYLE}
        />
      </Link>
    }
    {(post.photos.length === 2 || post.photos.length === 4) &&
      <div
        style={{
          ...FLEX,
          ...POS_REL,
          flexWrap: 'wrap',
        }}
      >
        {post.photos.map((photo, photoIndex) =>
          <div
            style={{
              width: '50%',
            }}
          >
            <Link key={`${index}${photoIndex}`} to={`/gallery/${index}`}>
              <Picture
                style={{
                  paddingBottom: imageRatio * containerWidth / 2,
                }}
                src={photo.alt_sizes[1].url}
              />
            </Link>
          </div>
         )}
        <span style={MID_BORDER} />
        {post.photos.length === 4 && <span style={BOTTOM_BORDER} />}
      </div>
    }
    {/*{post.photos.length === 4 &&
    post.photos.map((photo, photoIndex) =>
      <Link key={`${index}${photoIndex}`} to={`/gallery/${index}`}>
        <Picture
          style={{
            paddingBottom: imageRatio * containerWidth / 2,
          }}
          src={photo.alt_sizes[1].url}
        />
      </Link>
     )
    }*/}
    <figcaption>
      <div style={DATE_STYLE}>
        <div>
          {formatDate(post.date)}
        </div>
        <div>
          <a
            download={`${post.timestamp}.jpg`}
            href={post.photos[0].original_size.url}
          >
            Download
          </a>
        </div>
      </div>

      {post.summary &&
        post.summary
      }
      {!!post.tags.length &&
        <div>
          {post.tags.map((tag, tagIndex) =>

            <Link key={tagIndex} to={`/archive/tag/${tag}`}>#{tag}</Link>
          )}

        </div>
      }
    </figcaption>
  </div>
);

Post.propTypes = {
  post: pt.object.isRequired,
  containerWidth: pt.number.isRequired,
  imageRatio: pt.number.isRequired,
  index: pt.number.isRequired
};

export default radium(Post);
