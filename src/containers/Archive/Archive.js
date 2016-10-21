import React, { Component, PropTypes as pt } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';
import last from 'lodash/last';
import { mapStateToProps } from './ArchiveSelectors';
import { loadRemaining } from 'redux/modules/tumblr';
import {
  OUTER_STYLE,
  HEADER_STYLE,
  MONTH_STYLE,
} from './Archive.styles';
import { Picture } from 'components';

const MONTH_MAP = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};
@asyncConnect([{
  promise: ({ store: { dispatch } }) => dispatch(loadRemaining()),
}])
@connect(mapStateToProps, {})
export default class Archive extends Component {
  static propTypes = {
    posts: pt.array.isRequired,
    postsByTag: pt.object.isRequired,
    postsById: pt.object.isRequired,
    postsByMonth: pt.object.isRequired,
    tags: pt.array.isRequired,
    params: pt.object.isRequired,
    children: pt.any,
    browserWidth: pt.number.isRequired
  }

  renderPosts = (posts) => {
    const {
      props: {
        params: { id: tagParam },
        browserWidth,
        posts: allPosts,
      }
    } = this;

    const link = tagParam
      ? `/archive/tag/${tagParam}/gallery/`
      : '/archive/gallery/';

    const remainder = (browserWidth - 1) % 76;
    const rowAmount = Math.floor((browserWidth - 1) / 76);
    const imageSize = 76 + remainder / rowAmount;

    return (

      <div
        style={{
          display: 'flex',
          width: browserWidth,
          flexWrap: 'wrap',
          borderLeft: '1px solid white'
        }}
      >


        {posts.map((post, index) =>
          post.photos && post.photos.map((photo, photoIndex) =>
            <Link
              key={`${index}-${photoIndex}`}
              to={`${link}${post.id}`}
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
            </Link>
          )
        )}
      </div>
    );
  }

  render() {
    const {
      params: {
        id: tagParam
      },
      posts,
      postsByMonth,
      postsByTag,
      postsById,
      children
    } = this.props;


    const galleryPosts = tagParam
      ? postsByTag[tagParam].map(postId => postsById[postId])
      : posts;

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
          <Helmet title="Archive" />
          {tagParam
            ? this.renderPosts(galleryPosts)
            : Object.keys(postsByMonth).reverse().map((monthKey) => (
              <div key={monthKey} style={MONTH_STYLE}>
                <h1 style={HEADER_STYLE}>{MONTH_MAP[monthKey]}</h1>
                {this.renderPosts(postsByMonth[monthKey])}
              </div>
            ))
          }
          {children && React.cloneElement(children, {
            slides: galleryPosts
              .filter(post => post.type === 'photo')
              .map(post => ({
                url: post.photos[0].original_size.url,
                ratio: post.photos[0].original_size.height / post.photos[0].original_size.width,
                id: post.id,
                summary: post.summary
              })
            )
          })}

        </main>
      </div>
    );
  }
}
