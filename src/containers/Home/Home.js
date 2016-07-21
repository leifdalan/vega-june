import React, { Component, PropTypes as pt } from 'react';
import { userSelector } from 'redux/modules/auth';


import {
  getNextPageSelector,
  getPostsByDateSelector,
  getImageRatiosSelector,
  getPagesSelector,
  getDataSelector,
  getLoadingSelector,
  load as loadInfo,
} from 'redux/modules/info';
import {
  getDistanceFromBottomSelector,
  setWindow,
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
  getDistanceFromBottomSelector,
  getLoadingSelector, (
    posts,
    nextPage,
    imageRatios,
    data,
    pages,
    user,
    distanceFromBottom,
    isLoading,
  ) => ({
    posts,
    nextPage,
    imageRatios,
    data,
    pages,
    user,
    distanceFromBottom,
    isLoading
  })
);

@asyncConnect([{
  promise: ({ store: { dispatch } }) => dispatch(loadInfo())
}])
@connect(mapStateToProps, { loadInfo, setWindow })
export default class Home extends Component {
  static propTypes = {
    posts: pt.array.isRequired,
    data: pt.object.isRequired,
    pages: pt.object.isRequired,
    imageRatios: pt.array.isRequired,
    nextPage: pt.number.isRequired,
    loadInfo: pt.func.isRequired,
    setWindow: pt.func.isRequired,
    user: pt.object,
    distanceFromBottom: pt.number,
    isLoading: pt.bool
  }

  componentWillReceiveProps(nextProps) {
    const {
      nextPage,
      distanceFromBottom,
      isLoading,
    } = nextProps;
    if (nextPage !== this.props.nextPage) {
      return this.props.setWindow();
    }
    // console.log(distanceFromBottom);
    if (distanceFromBottom < 500 && distanceFromBottom > -51 && !isLoading) {
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

  render() {
    const {
      props: {
        posts,
        user,
        imageRatios,
        isLoading,
      },
    } = this;

    // const isLoading = pages[nextPage] && pages[nextPage].loading;
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
            {isLoading && this.loadingSpinner()}
          </div>
          :
          <Login />
        }
      </div>
    );
  }
}
