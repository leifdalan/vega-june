import React, { Component, PropTypes as pt } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from 'containers/Archive/ArchiveSelectors';
import Modal from 'react-modal';
import findIndex from 'lodash/findIndex';
import { withRouter } from 'react-router';
import { Picture } from 'components';
import LeftArrow from 'components/svg/LeftArrow';
import RightArrow from 'components/svg/RightArrow';
import {
  MODAL_STYLES,
  IMG_STYLES,
  IMG_CONTAINER_STYLES,
  PREV_DEFAULT,
  CURRENT_DEFAULT,
  NEXT_DEFAULT,
  SUMMARY_STYLES,
  SUMMARY_CONTAINER_STYLES,
  CLOSE_CONTAINER_STYLES
} from './Gallery.styles';
import Swipeable from 'react-swipeable';

@withRouter
@connect(mapStateToProps, {})
export default class Gallery extends Component {

  static propTypes = {
    history: pt.object.isRequired,
    params: pt.object.isRequired,
    slides: pt.array.isRequired,
    router: pt.object.isRequired,
  }


  constructor(...args) {
    super(...args);
    const index = findIndex(this.props.slides, slide =>
      parseInt(this.props.params.index, 10) === slide.id
    );
    this.state = {
      goToCurrent: false,
      goToNext: false,
      goToPrev: false,
      swipe: 0,
      transitionDuration: 0.3,
      showExtras: false,
      index,
    };
  }

  componentDidMount() {
    this.showExtras();
    window.addEventListener('keydown', this.handleKeyboard);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyboard);
  }

  handleKeyboard = (e) => {
    switch (e.keyCode) {
      case 37:
        this.goToPrev();
        break;
      case 39:
        this.goToNext();
        break;
      default:
        break;
    }
  }

  handleRequestClose = () => {
    const location = this.props.location.pathname;
    const base = location.split('gallery')[0];
    this.props.router.push(base);
  }

  handleSwiping = (e, abs) => {
    e.preventDefault();
    this.setState({
      swipe: abs,
    });
  }

  showExtras = () => {
    clearTimeout(this.summaryTimeout);
    this.summaryTimeout = setTimeout(() => {
      this.setState({
        showExtras: true,
      });
    }, 500);
  }

  goToNext = () => {
    const {
      index,
      transitionDuration,
    } = this.state;
    const timeout = transitionDuration * 1000;

    this.setState({
      goToNext: true,
      showExtras: false,
    });
    setTimeout(() => {
      const actualIndex = index + 1 === this.props.slides.length ? 0 : index + 1;
      this.setState({
        goToNext: false,
        index: actualIndex
      });
      this.showExtras();
    }, timeout);
  }

  goToPrev = () => {
    const {
      index,
      transitionDuration,
    } = this.state;
    const timeout = transitionDuration * 1000;

    this.setState({
      goToPrev: true,
      showExtras: false,
    });
    setTimeout(() => {
      const actualIndex = index - 1 < 0 ? this.props.slides.length - 1 : index - 1;
      this.setState({
        goToPrev: false,
        index: actualIndex
      });
      this.showExtras();
    }, timeout);
  }

  handleSwiped = (e, abs) => {
    const {
      index,
      transitionDuration,
    } = this.state;
    const timeout = transitionDuration * 1000;
    this.setState({
      swipe: 0
    });
    clearTimeout(this.summaryTimeout);
    if (abs > 50) {
      this.goToNext();
    } else if (abs < -50) {
      this.goToPrev();
    } else {
      this.setState({
        goToCurrent: true,
      });
      setTimeout(() => {
        this.setState({
          goToCurrent: false,
        });
      }, timeout);
    }
  }

  render() {
    const {
      handleSwiping,
      handleSwiped,
      handleRequestClose,
      props: {
        slides,
        browserHeight,
        browserWidth,
        hasTouch,
      },
      state: {
        swipe,
        index,
        goToPrev,
        goToNext,
        goToCurrent,
        transitionDuration,
        showExtras,
      }
    } = this;
    let firstSlideStyle;
    let secondSlideStyle;
    let thirdSlideStyle;
    firstSlideStyle = secondSlideStyle = thirdSlideStyle = {};
    const TRANSITION_STYLES = {
      transitionProperty: 'transform',
      transitionDuration: `${transitionDuration}s`
    };
    switch (true) {
      case goToPrev:
        firstSlideStyle = {
          ...TRANSITION_STYLES,
          ...CURRENT_DEFAULT,
          zIndex: 2
        };
        secondSlideStyle = {
          ...TRANSITION_STYLES,
          ...NEXT_DEFAULT,
        };
        thirdSlideStyle = {
          display: 'none'
        };
        break;
      case goToNext:
        firstSlideStyle = {
          display: 'none'
        };
        secondSlideStyle = {
          ...TRANSITION_STYLES,
          ...PREV_DEFAULT,
        };
        thirdSlideStyle = {
          ...TRANSITION_STYLES,
          ...CURRENT_DEFAULT,

        };
        break;
      case goToCurrent:
        firstSlideStyle = {
          ...TRANSITION_STYLES,
          ...PREV_DEFAULT,
        };
        secondSlideStyle = {
          ...TRANSITION_STYLES,
          ...CURRENT_DEFAULT,
        };
        thirdSlideStyle = {
          ...TRANSITION_STYLES,
          ...NEXT_DEFAULT,
        };

        break;
      default:
        firstSlideStyle = {
          zIndex: swipe < 0 ? 2 : 0,
          transform: `rotateY(${-110 + (-swipe / 2)}deg)`,
        };
        secondSlideStyle = {
          transform: `rotateY(${-swipe / 2}deg)`,
        };
        thirdSlideStyle = {
          transform: `rotateY(${110 + (-swipe / 2)}deg)`,
        };
        break;
      // default:
      //   break;

    }
    const prevIndex = index - 1 < 0 ? this.props.slides.length - 1 : index - 1;
    const prevPreload1 = prevIndex - 1 < 0 ? this.props.slides.length - 1 : prevIndex - 1;
    const nextIndex = index + 1 === this.props.slides.length ? 0 : index + 1;
    const preload1 = nextIndex + 1 === this.props.slides.length ? 0 : nextIndex + 1;
    const preload2 = preload1 + 1 === this.props.slides.length ? 0 : preload1 + 1;
    const windowIsPortrait = browserWidth < browserHeight;
    return (
      <Modal
        isOpen
        onRequestClose={handleRequestClose}
        style={MODAL_STYLES}
      >
        <Swipeable
          onSwiping={handleSwiping}
          onSwiped={handleSwiped}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            perspective: '1000px',
            transformOrigin: 'left',
          }}
        >
          {!hasTouch &&
            <div
              onClick={this.goToNext}
              style={{
                position: 'absolute',
                top: '50%',
                marginTop: -25,
                left: 0,
              }}
            >
            <LeftArrow
              size={50}
              fill="white"
              style={{
                zIndex: 3,
                position: 'relative',
              }}
              />
            </div>
          }
          {!hasTouch &&
            <div
              onClick={this.goToPrev}
              style={{
                position: 'absolute',
                top: '50%',
                marginTop: -25,
                right: 0
              }}

            >
            <RightArrow
              size={50}
              fill="white"
              style={{
                zIndex: 3,
                position: 'relative',
              }}
              />
            </div>
          }

          <div
            style={{
              ...IMG_CONTAINER_STYLES,
              ...firstSlideStyle,
            }}
          >
            <Picture
              src={slides[prevIndex].url}
              ratio={slides[prevIndex].ratio}
              isInPortraitContainer={windowIsPortrait}
              style={{
                ...IMG_STYLES,
              }}

            />
          </div>


          <div
            style={{
              ...IMG_CONTAINER_STYLES,
              zIndex: 1,
              ...secondSlideStyle,
            }}
            onClick={handleRequestClose}
          >

            <Picture
              src={slides[index].url}
              ratio={slides[index].ratio}
              isInPortraitContainer={windowIsPortrait}
              style={{
                ...IMG_STYLES,
              }}
            />


          </div>

          <div
            style={{
              ...IMG_CONTAINER_STYLES,
              ...thirdSlideStyle,
            }}
          >

            <Picture
              src={slides[nextIndex].url}
              ratio={slides[nextIndex].ratio}
              isInPortraitContainer={windowIsPortrait}
              style={{
                ...IMG_STYLES,
              }}

            />

          </div>
            <div
              style={{
                ...SUMMARY_CONTAINER_STYLES,
                ...(showExtras && slides[index].summary) ? {
                  opacity: 1,
                  bottom: 30,
                } : {
                  opacity: 0,
                  bottom: 10
                }
              }}>
              <p style={SUMMARY_STYLES}>{slides[index].summary}</p>
            </div>
            <div
              style={{
                ...CLOSE_CONTAINER_STYLES,
                ...(showExtras) ? {
                  opacity: 1,
                  right: 0,
                } : {
                  opacity: 0,
                  right: -30
                }
              }}
              onClick={handleRequestClose}
            >
              &#10005;
            </div>


          <Picture
            src={slides[preload1].url}
            ratio={slides[preload1].ratio}
            style={{
              ...IMG_STYLES,
              opacity: 0,
            }}
          />
          <Picture
            src={slides[preload2].url}
            ratio={slides[preload2].ratio}
            style={{
              ...IMG_STYLES,
              opacity: 0,
              height: 0,
              width: 0,
            }}
          />
          <Picture
            src={slides[prevPreload1].url}
            ratio={slides[prevPreload1].ratio}
            style={{
              ...IMG_STYLES,
              opacity: 0,
              height: 0,
              width: 0,
            }}
          />

        </Swipeable>

      </Modal>

    );
  }
}
