import React, { Component, PropTypes as pt } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from 'containers/Archive/ArchiveSelectors';
import Modal from 'react-modal';
import findIndex from 'lodash/findIndex';
import { withRouter } from 'react-router';
import { Picture } from 'components';
import {
  MODAL_STYLES,
  IMG_STYLES,
  IMG_CONTAINER_STYLES,
  PREV_DEFAULT,
  CURRENT_DEFAULT,
  NEXT_DEFAULT,
  SUMMARY_STYLES,
  SUMMARY_CONTAINER_STYLES
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
      index,
    };
  }

  handleRequestClose = () => this.props.router.goBack()

  handleSwiping = (e, abs) => {
    this.setState({
      swipe: abs,
    });
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
    if (abs > 50) {
      this.setState({
        goToNext: true,
      });
      setTimeout(() => {
        const actualIndex = index + 1 === this.props.slides.length ? 0 : index + 1;
        this.setState({
          goToNext: false,
          index: actualIndex
        });
      }, timeout);
    } else if (abs < -50) {
      this.setState({
        goToPrev: true,
      });
      setTimeout(() => {
        const actualIndex = index - 1 < 0 ? this.props.slides.length - 1 : index - 1;
        this.setState({
          goToPrev: false,
          index: actualIndex
        });
      }, timeout);
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
        slides
      },
      state: {
        swipe,
        index,
        goToPrev,
        goToNext,
        goToCurrent,
        transitionDuration,
      }
    } = this;
    let firstSlideStyle;
    let secondSlideStyle;
    let thirdSlideStyle;
    firstSlideStyle = secondSlideStyle = thirdSlideStyle = {};
    const TRANSITION_STYLES = {
      transitionProperty: 'transform',
      transitionDuration
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
          <div
            style={{
              ...IMG_CONTAINER_STYLES,
              ...firstSlideStyle,
            }}
          >
            <Picture
              src={slides[prevIndex].url}
              ratio={slides[prevIndex].ratio}
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
              style={{
                ...IMG_STYLES,
              }}

            />

          </div>
          {!swipe &&
            <div style={SUMMARY_CONTAINER_STYLES}>
              <p style={SUMMARY_STYLES}>{slides[index].summary}</p>
            </div>
          }

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
