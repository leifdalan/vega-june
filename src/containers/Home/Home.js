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

  componentDidUpdate() {
    // this.calculateContainerWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.throttledCalculateContainerWidth);
  }

  getPostHeight = index => {
    const {
      posts,
      imageRatios,
      containerWidth
    } = this.props;
    const post = posts[index];
    // wtf?
    if (!post) return 0;
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

  calculateContainerWidth = () => this
    .props
    .setContainerWidth(
      this.container.getBoundingClientRect().width
    )

  throttledCalculateContainerWidth = () => throttle(this.calculateContainerWidth, 500)()

  containerRef = el => this.container = el // eslint-disable-line no-return-assign

  render() {
    const {
      getPostHeight,
      containerRef,
      props: {
        posts,
        children,
        imageRatios,
        containerWidth,
        allPosts,
      },
    } = this;

    const {
      postElements,
      elementHeights
    } = reduce(allPosts, (out, post, index) => ({
      postElements: [
        ...out.postElements,
        post.type === 'youtube'
          ? <VideoPost
            post={post}
            containerWidth={containerWidth}
            />
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
          <p
            style={{
              ...CENTER_STYLE,
              textTransform: 'none',
            }}
          >
            I'm a baby
          </p>
          {feed}

          {/* This is for the gallery */}
          {children && React.cloneElement(children, {
            slides: posts
              .filter(post => post.type === 'photo')
              .map(post => ({
                url: post.photos[0].original_size.url,
                ratio: post.photos[0].original_size.height / post.photos[0].original_size.width,
                id: post.id,
                summary: post.summary
              })
            )
          })}
        </div>
      </div>
    );
  }
}
