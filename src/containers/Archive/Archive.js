import React, { Component, PropTypes as pt } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';
import last from 'lodash/last';
import {
  loadRemaining,
  getAllThumbnails,
  preloadImages,
} from 'redux/modules/info';
import { mapStateToProps } from './ArchiveSelectors';

@asyncConnect([{
  promise: ({ store: { dispatch, getState } }) => new Promise(resolve => {
    dispatch(loadRemaining()).then(() => {
      if (__CLIENT__) {
        const thumbnails = getAllThumbnails(getState());
        dispatch(preloadImages(thumbnails)).then(resolve);
      } else {
        resolve();
      }
    });
  })
}])
@connect(mapStateToProps, {})
export default class Archive extends Component {
  static propTypes = {
    posts: pt.array.isRequired,
    postsByTag: pt.object.isRequired,
    postsById: pt.object.isRequired,
    tags: pt.array.isRequired,
    params: pt.object.isRequired,
    children: pt.any
  }
  render() {
    const {
      props: {
        posts,
        postsByTag,
        tags,
        postsById,
        children,
        params: { id: tagParam }
      }
    } = this;
    const renderedPosts = tagParam
      ? postsByTag[tagParam].map(postId => postsById[postId])
      : posts;
    const link = tagParam
      ? `/archive/tag/${tagParam}/gallery/`
      : '/archive/gallery/';
    return (
      <div>
        <Helmet title="Home" />
        {tags.map(tag => <Link key={tag} to={`/archive/tag/${tag}`}>{tag}</Link>)}
        {renderedPosts.map((post, index) =>
          post.photos.map((photo, photoIndex) =>
            <Link key={`${index}-${photoIndex}`} to={`${link}${index}`}>
              <img alt={index} src={last(photo.alt_sizes).url} />
            </Link>
        ))}
        {children && React.cloneElement(children, {
          slides: renderedPosts.map(post => post.photos[0].original_size.url)
        })}

      </div>
    );
  }
}
