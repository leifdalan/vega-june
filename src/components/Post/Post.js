import React, { PropTypes as pt } from 'react';
import { Link } from 'react-router';

const Post = ({ post, containerWidth, imageRatio, index }) => (
  <div key={post.id}>
    {post.photos.length === 1 ?
      <Link key={index} to={`/gallery/${index}`}>
        <figure
          style={{
            width: '100%',
            paddingBottom: imageRatio * containerWidth,
            position: 'relative',
            background: 'red'
          }}
          key={post.id}
          >
          <img
            alt={'something'}
            style={{
              width: '100%',
              position: 'absolute',
              height: '100%',
            }}
            src={post.photos[0].alt_sizes[1].url}
            />
        </figure>
      </Link>
      :
      post.photos.map((photo, photoIndex) =>
        <Link key={`${index}${photoIndex}`} to={`/gallery/${index}`}>
          <figure
            style={{
              width: '50%',
              paddingBottom: imageRatio * containerWidth / 2,
              position: 'relative',
              background: 'red',
              display: 'inline-block',
              lineHeight: 0,
              fontSize: 0,
            }}
            key={post.id}
            >
            <img
              alt={'something'}
              style={{
                width: '100%',
                position: 'absolute',
                height: '100%',
              }}
              src={photo.alt_sizes[1].url}
              />
          </figure>
        </Link>
     )
    }
    {post.summary &&
      <figcaption>{post.summary}</figcaption>
    }
    {!!post.tags.length &&
      <figcaption>
        {post.tags.map((tag, tagIndex) =>
          <a key={tagIndex} href={tag}>{tag}</a>
        )}
      </figcaption>
    }
  </div>
);

Post.propTypes = {
  post: pt.object.isRequired,
  containerWidth: pt.number.isRequired,
  imageRatio: pt.number.isRequired,
  index: pt.number.isRequired
};

export default Post;
