import React, { Component, PropTypes as pt } from 'react';
import { userSelector } from 'redux/modules/auth';
import throttle from 'lodash/throttle';
import { Link } from 'react-router';

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

  shouldComponentUpdate(nextProps) {
    return (nextProps.distanceFromBottom === this.props.distanceFromBottom);
  }

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
        imageRatios,
        isLoading,
        containerWidth,
        children
      },
    } = this;


    return (
      <div
        className="container"
        ref={containerRef}
        style={{
          padding: 0
        }}
      >
        <Helmet title="Home" />
        {user ?
          <div>
            {posts.map((post, index) => (
              <div>
                <Link key={index} to={`/gallery/${index}`}>
                  <figure
                    style={{
                      width: '100%',
                      paddingBottom: imageRatios[index] * containerWidth,
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
                </Link>
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
