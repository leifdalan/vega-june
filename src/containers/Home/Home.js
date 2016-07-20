import React, { Component, PropTypes as pt } from 'react';
import { userSelector } from 'redux/modules/auth';

import {
  getNextPageSelector,
  getPostsByDateSelector,
  getImageRatiosSelector,
  getPagesSelector,
  getDataSelector,
  load as loadInfo,
} from 'redux/modules/info';
import {
  getDistanceFromBottomSelector
} from 'redux/modules/browser';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Helmet from 'react-helmet';

import { createSelector } from 'reselect';
import { Login } from 'containers';


const mapStateToProps = createSelector(
  getPostsByDateSelector,
  getNextPageSelector,
  getImageRatiosSelector,
  getDataSelector,
  getPagesSelector,
  userSelector,
  getDistanceFromBottomSelector, (
    posts,
    nextPage,
    imageRatios,
    data,
    pages,
    user,
    distanceFromBottom
  ) => ({
    posts,
    nextPage,
    imageRatios,
    data,
    pages,
    user,
    distanceFromBottom,
  })
);

@asyncConnect([{
  promise: ({ store: { dispatch } }) => dispatch(loadInfo())
}])
@connect(mapStateToProps, { loadInfo })
export default class Home extends Component {
  static propTypes = {
    posts: pt.array.isRequired,
    data: pt.object.isRequired,
    pages: pt.object.isRequired,
    imageRatios: pt.array.isRequired,
    nextPage: pt.number.isRequired,
    loadInfo: pt.func.isRequired,
    user: pt.object,
    distanceFromBottom: pt.number,
  }

  componentWillReceiveProps(nextProps) {
    const {
      pages,
      nextPage,
      distanceFromBottom,
    } = nextProps;
    const isLoading = pages[nextPage] && pages[nextPage].loading;
    console.error('isLoading', pages, nextPage);
    console.error('distanceFromBottom', distanceFromBottom);
    if (distanceFromBottom < 100 && !isLoading) {
      this.props.loadInfo(nextPage);
    }
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.distanceFromBottom === this.props.distanceFromBottom);
  }

  handleInfiniteLoad = () => {
    this.props.loadInfo(this.props.nextPage);
  }

  loadingSpinner = () => <div>Loading...</div>

  handleScroll = () => {
    console.log('scrolling');
    const [firstVisibleIndex, lastVisibleIndex] = this.list.getVisibleRange();
    console.log(firstVisibleIndex, lastVisibleIndex);
    if (lastVisibleIndex < this.props.posts.length - 3) this.props.loadInfo(this.props.nextPage);
  }

  render() {
    const {
      props: {
        pages,
        posts,
        nextPage,
        user,
        imageRatios
      },
    } = this;

    const isLoading = pages[nextPage] && pages[nextPage].loading;
    console.log('is rendering', user);
    return (
      <div>
        <Helmet title="Home" />
        {user ?
          <div>
            {posts.map((post, index) => (
              <div>
                <figure
                  style={{
                    width: '100%',
                    paddingBottom: imageRatios[index] * 600,
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
                    src={post.photos[0].original_size.url}
                  />

                </figure>
                {post.summary &&
                  <figcaption>{post.summary}</figcaption>
                }
                {post.tags.length &&
                  <figcaption>
                    {post.tags.map((tag, tagIndex) =>
                      <a key={tagIndex} href={tag}>{tag}</a>
                    )}
                  </figcaption>
                }
              </div>
            ))}
          </div>
          :
          <Login />
        }
      </div>
    );
  }
}
