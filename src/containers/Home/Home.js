import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import { Post } from 'components';
import Infinite from 'react-infinite';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import Helmet from 'react-helmet';
import { Login } from 'containers';
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

@asyncConnect([{
  promise: ({ store: { dispatch } }) => dispatch(actions.loadInfo())
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
      // distanceFromBottom,
      // isLoading,
    } = nextProps;
    if (nextPage !== this.props.nextPage) {
      return this.props.setWindow();
    }
    // console.log(distanceFromBottom);
    // if (distanceFromBottom < 500 && distanceFromBottom > -51 && !isLoading) {
    //   this.props.loadInfo(nextPage);
    // }
  }

  componentDidUpdate() {
    this.calculateContainerWidth();
  }
  // shouldComponentUpdate(nextProps) {
  //   return (nextProps.distanceFromBottom === this.props.distanceFromBottom);
  // }

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

    const Scroller = {
      element: __CLIENT__ ? Infinite : 'div'
    };

    const {
      postElements,
      elementHeights
    } = reduce(posts, (out, post, index) => ({
      postElements: [
        ...out.postElements,
        <Post
          post={post}
          key={index}
          index={index}
          containerWidth={containerWidth}
          imageRatio={imageRatios[index]}
        />
      ],
      elementHeights: [
        ...out.elementHeights,
        imageRatios[index] * containerWidth + (
          post.summary ? 20 : 0
        ) + (
          !!post.tags.length ? 20 : 0
        )
      ]
    }), {
      postElements: [],
      elementHeights: []
    });
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
            <h1 style={CENTER_STYLE}>VEGA JUNE</h1>
            <p style={CENTER_STYLE}>I'm a baby</p>
            <Scroller.element
              useWindowAsScrollContainer
              elementHeight={elementHeights}
              infiniteLoadBeginEdgeOffset={200}
              onInfiniteLoad={this.handleInfiniteLoad}
            >
              {postElements}
            </Scroller.element>

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
