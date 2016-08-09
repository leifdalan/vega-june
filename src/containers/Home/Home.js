import React, { Component, PropTypes as pt } from 'react';
import { userSelector } from 'redux/modules/auth';
import throttle from 'lodash/throttle';
// import { Link } from 'react-router';
import { Post } from 'components';

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
  getContainerWidthSelector,
  setWindow,
  setContainerWidth,
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
  getLoadingSelector,
  getContainerWidthSelector, (
    posts,
    nextPage,
    imageRatios,
    data,
    pages,
    user,
    distanceFromBottom,
    isLoading,
    containerWidth,
  ) => ({
    posts,
    nextPage,
    imageRatios,
    data,
    pages,
    user,
    distanceFromBottom,
    isLoading,
    containerWidth
  })
);

@asyncConnect([{
  promise: ({ store: { dispatch } }) => dispatch(loadInfo())
}])
@connect(mapStateToProps, { loadInfo, setWindow, setContainerWidth })
export default class Home extends Component {
  static propTypes = {
    posts: pt.array.isRequired,
    data: pt.object.isRequired,
    pages: pt.object.isRequired,
    imageRatios: pt.array.isRequired,
    nextPage: pt.number.isRequired,
    loadInfo: pt.func.isRequired,
    setWindow: pt.func.isRequired,
    setContainerWidth: pt.func.isRequired,
    user: pt.object,
    distanceFromBottom: pt.number,
    isLoading: pt.bool,
    containerWidth: pt.number,
    children: pt.any
  }

  componentDidMount() {
    window.addEventListener('resize', this.throttledCalculateContainerWidth);
    this.calculateContainerWidth();
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

  // shouldComponentUpdate(nextProps) {
  //   return (nextProps.distanceFromBottom === this.props.distanceFromBottom);
  // }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledCalculateContainerWidth);
  }

  calculateContainerWidth = () => this.props.setContainerWidth(this.container.getBoundingClientRect().width)

  throttledCalculateContainerWidth = () => throttle(this.calculateContainerWidth, 500)()

  handleInfiniteLoad = () => {
    this.props.loadInfo(this.props.nextPage);
  }

  loadingSpinner = () => <div>Loading...</div>

  containerRef = el => this.container = el // eslint-disable-line no-return-assign

  render() {
    const {
      containerRef,
      loadingSpinner,
      props: {
        posts,
        user,
        isLoading,
        children,
        imageRatios,
        containerWidth
      },
    } = this;

    return (
      <div
        className="container"
        ref={containerRef}
        style={{
          padding: 0,
          maxWidth: '600px'
        }}
      >
        <Helmet title="Home" />
        {user ?
          <div>
            <h1>VEGA JUNE</h1>
            <p>I'm a baby</p>

            {posts.map((post, index) => (
              <Post
                post={post}
                key={index}
                index={index}
                containerWidth={containerWidth}
                imageRatio={imageRatios[index]}
              />
            ))}
            {isLoading && loadingSpinner()}
            {children && React.cloneElement(children, {
              slides: posts.map(post => post.photos[0].original_size.url)
            })}
          </div>
          :
          <Login />
        }
      </div>
    );
  }
}
