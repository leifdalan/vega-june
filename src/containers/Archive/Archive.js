import React, { Component, PropTypes as pt } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';
import last from 'lodash/last';
import {
  loadRemaining,
} from 'redux/modules/info';
import { mapStateToProps } from './ArchiveSelectors';
import {
  OUTER_STYLE
} from './Archive.styles';
import Picture from 'components/Picture';

@asyncConnect([{
  deferred: __CLIENT__,
  promise: ({ store: { dispatch } }) => dispatch(loadRemaining())
}])
@connect(mapStateToProps, {})
export default class Archive extends Component {
  static propTypes = {
    posts: pt.array.isRequired,
    postsByTag: pt.object.isRequired,
    postsById: pt.object.isRequired,
    tags: pt.array.isRequired,
    params: pt.object.isRequired,
    children: pt.any,
    browserWidth: pt.number.isRequired
  }

  render() {
    const {
      props: {
        posts,
        postsByTag,
        postsById,
        children,
        params: { id: tagParam },
        browserWidth
      }
    } = this;
    const renderedPosts = tagParam
      ? postsByTag[tagParam].map(postId => postsById[postId])
      : posts;
    const link = tagParam
      ? `/archive/tag/${tagParam}/gallery/`
      : '/archive/gallery/';

    const remainder = (browserWidth - 1) % 76;
    const rowAmount = Math.floor((browserWidth - 1) / 76);
    const imageSize = 76 + remainder / rowAmount;
    console.error('remainder, rowAmount, imageSize', remainder, rowAmount, imageSize);
    return (
      <div
        style={OUTER_STYLE}
        id="outer-container"
      >
        <main
          id="page-wrap"
          style={{
            width: '100%'
          }}

        >
          <Helmet title="Home" />
          <div
            style={{
              display: 'flex',
              width: browserWidth,
              flexWrap: 'wrap',
              borderLeft: '1px solid white'
            }}
          >

            {renderedPosts.map((post, index) =>
              post.photos.map((photo, photoIndex) =>
              <Link
                key={`${index}-${photoIndex}`}
                to={`${link}${index}`}
                >

                <div
                  style={{
                    width: imageSize,
                    fontSize: 0,
                    lineHeight: 0,
                    borderRight: '1px solid white',
                    borderBottom: '1px solid white'
                  }}
                  >
                  <Picture
                    src={last(photo.alt_sizes).url}
                    ratio={1}
                    />
                </div>
                {/*<img alt={index} src={last(photo.alt_sizes).url} />*/}
              </Link>
            ))}
          </div>
          {children && React.cloneElement(children, {
            slides: renderedPosts.map(post => post.photos[0].original_size.url)
          })}
        </main>
      </div>
    );
  }
}
