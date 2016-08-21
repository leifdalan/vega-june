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
import Video from 'react-html5video';
import {
  mapStateToProps,
  actions,
  propTypes
} from './HomeSelectors';
import {
  CENTER_STYLE
} from './Home.styles';
import VideoPost from 'components/VideoPost/VideoPost';

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
        post.video ?
        <VideoPost post={post} /> :
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
      {/*<video controls autoplay id='embed-57b8904ca7e94063362860' class='crt-video crt-skin-default' width='500' height='889' poster='https://66.media.tumblr.com/tumblr_oc7268zUeU1vw7u75_smart1.jpg' preload='none' muted data-crt-video data-crt-options='{"autoheight":null,"duration":30,"hdUrl":"https:\/\/api.tumblr.com\/video_file\/149210296168\/tumblr_oc7268zUeU1vw7u75\/720","filmstrip":{"url":"https:\/\/66.media.tumblr.com\/previews\/tumblr_oc7268zUeU1vw7u75_filmstrip.jpg","width":"200","height":"357"}}' > <source src="https://api.tumblr.com/video_file/149210296168/tumblr_oc7268zUeU1vw7u75/480" type="video/mp4" /> </video>*/}
        <Helmet title="Home" />
          <Video controls loop muted>
                <source src="https://api.tumblr.com/video_file/149210296168/tumblr_oc7268zUeU1vw7u75/480" type="video/mp4" />
            </Video>

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
