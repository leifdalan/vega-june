import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import { Post } from 'components';
import Infinite from 'react-infinite';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';
import reduce from 'lodash/reduce';
import { window } from 'utils/lib';
import {
  mapStateToProps,
  actions,
  propTypes
} from './HomeSelectors';
import {
  CENTER_STYLE
} from './Home.styles';
import {
  POST_CONTAINER,
  PICTURE_STYLE,
} from 'components/Post/Post.styles';
import VideoPost from 'components/VideoPost/VideoPost';

@asyncConnect([{
  promise: ({ store: { dispatch } }) => dispatch(actions.loadRemaining()),
}])
@connect(mapStateToProps, actions)
export default class Home extends Component {

  static propTypes = propTypes

  componentDidMount() {
    window.addEventListener('resize', this.throttledCalculateContainerWidth);
    this.calculateContainerWidth();
  }

  componentWillReceiveProps(nextProps) {
    const {
      nextPage,
    } = nextProps;
    if (nextPage !== this.props.nextPage) {
      return this.props.setWindow();
    }
  }

  componentDidUpdate() {
    this.calculateContainerWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledCalculateContainerWidth);
  }

  calculateContainerWidth = () => this
  .props
  .setContainerWidth(
    this.container.getBoundingClientRect().width
  )

  throttledCalculateContainerWidth = () => throttle(this.calculateContainerWidth, 500)()

  handleInfiniteLoad = () => {
    const {
      isLoading,
      loadInfo,
      nextPage
    } = this.props;
    if (!isLoading) loadInfo(nextPage);
  }

  loadingSpinner = () => (
    <h1 style={{
        letterSpacing: 4,
        textAlign: 'center'
      }}>
      LOADING...
    </h1>
  )

  containerRef = el => this.container = el // eslint-disable-line no-return-assign

  getPostHeight = index => {
    const {
      posts,
      imageRatios,
      containerWidth
    } = this.props;
    const post = posts[index];
    let photoHeight = imageRatios[index] * containerWidth;
    if (post.type === 'photo' && post.photos.length === 2) {
      photoHeight = photoHeight / 2;
    }
    return photoHeight + (
      // Add 20 for summary
      post.summary ? 20 : 0
    ) + (
      // Add 20 for tags
      !!post.tags.length ? 20 : 0
    ) +
      // and all the padding/margin
      POST_CONTAINER.marginBottom +
      POST_CONTAINER.paddingBottom +
      PICTURE_STYLE.marginBottom;
  }

  render() {
    const {
      getPostHeight,
      containerRef,
      loadingSpinner,
      props: {
        posts,
        isLoading,
        children,
        imageRatios,
        containerWidth
      },
    } = this;


    const {
      postElements,
      elementHeights
    } = reduce(posts, (out, post, index) => ({
      postElements: [
        ...out.postElements,
        post.type === 'video'
          ? <VideoPost post={post} />
          : <Post
            post={post}
            key={index}
            index={index}
            containerWidth={containerWidth}
            imageRatio={imageRatios[index]}
          />
      ],
      elementHeights: [
        ...out.elementHeights,
        getPostHeight(index)
      ]
    }), {
      postElements: [],
      elementHeights: []
    });

    let feed;

    if (__CLIENT__) {
      feed = (
        <Infinite
          useWindowAsScrollContainer
          elementHeight={elementHeights}
          infiniteLoadBeginEdgeOffset={200}
          onInfiniteLoad={this.handleInfiniteLoad}
        >
          {postElements}
        </Infinite>
      );
    } else {
      feed = (
        <div>
          {postElements.slice(0, 20)}
        </div>
      );
    }
    return (
      <div
        className="container"
        ref={containerRef}
        style={{
          padding: 15,
          maxWidth: '600px'
        }}
      >

        <Helmet title="Home" />

        <div>
          <h1 style={CENTER_STYLE}>VEGA JUNE</h1>
          <p style={CENTER_STYLE}>I'm a baby</p>
          {feed}
          {isLoading && loadingSpinner()}

          {/* This is for the gallery */}
          {children && React.cloneElement(children, {
            slides: posts
              .filter(post => post.type === 'photo')
              .map(post => ({
                url: post.photos[0].original_size.url,
                ratio: post.photos[0].original_size.height / post.photos[0].original_size.width,
                id: post.id,
              })
            )
          })}
        </div>
      </div>
    );
  }
}
