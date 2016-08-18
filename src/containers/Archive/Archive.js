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
import { scaleRotate as Menu } from 'react-burger-menu';
import {
  BURGER_STYLES,
  OUTER_STYLE
} from './Archive.styles';

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
    children: pt.any
  }

  state = {
    menuOpen: false
  }

  toggleMenu = () => this.setState({menuOpen: !this.state.menuOpen})

  render() {
    const {
      toggleMenu,
      state: {
        menuOpen,
      },
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
      <div
        style={OUTER_STYLE}
        id="outer-container"
      >
        <a onClick={toggleMenu}>TAGS</a>
        <Menu
          isOpen={menuOpen}
          right
          customBurgerIcon={false}
          styles={BURGER_STYLES}
          pageWrapId={"page-wrap"}
          outerContainerId={"outer-container"}
        >
          <ul>
            {tags.map(tag =>
              <li key={tag}>
                <Link
                  to={`/archive/tag/${tag}`}
                  onClick={toggleMenu}
                  >
                  {tag}
                </Link>
              </li>
            )}
          </ul>
        </Menu>
        <main id="page-wrap">
          <Helmet title="Home" />

          {renderedPosts.map((post, index) =>
            post.photos.map((photo, photoIndex) =>
              <Link key={`${index}-${photoIndex}`} to={`${link}${index}`}>
                <img alt={index} src={last(photo.alt_sizes).url} />
              </Link>
          ))}
          {children && React.cloneElement(children, {
            slides: renderedPosts.map(post => post.photos[0].original_size.url)
          })}
        </main>
      </div>
    );
  }
}
