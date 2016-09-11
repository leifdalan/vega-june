import React, { Component, PropTypes as pt } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from 'containers/Archive/ArchiveSelectors';
// import ReactSwipe from 'react-swipe';
import Modal from 'react-modal';
import { withRouter } from 'react-router';
import { Picture } from 'components';
import {
  MODAL_STYLES,
  IMG_STYLES,
  IMG_CONTAINER_STYLES,
  PREV_DEFAULT,
  CURRENT_DEFAULT,
  NEXT_DEFAULT,
  TRANSITION_STYLES,
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
    this.state = {
      swipeLeft: 0,
      swiperight: 0,
      hasSwiped: false,
      goToCurrent: false,
      goToNext: false,
      goToPrev: false,
      swipe: 0,
      index: parseInt(this.props.params.index, 10)
    };
  }

  handleRequestClose = () => this.props.router.goBack()

  handleSwipingLeft = (e, abs) => {
    this.setState({
      swipeLeft: abs
    });
  }

  handleSwipedLeft = (e, abs) => {
    if (abs > 50) {
      this.setState({
        hasSwiped: true,
      });
    }
  }
  handleSwipingRight = (e, abs) => {
    this.setState({
      swipeRight: abs
    });
  }

  handleSwipedRight = (e, abs) => {
    if (abs > 50) {
      this.setState({
        hasSwiped: true,
      });
    }
  }

  handleSwiping = (e, abs) => {
    this.setState({
      swipe: abs,
    });
  }

  handleSwiped = (e, abs) => {
    const { index } = this.state;
    this.setState({
      swipe: 0
    });
    if (abs > 50) {
      this.setState({
        goToCurrent: false,
        goToNext: true,
        goToPrev: false,
      });
      setTimeout(() => {
        this.setState({
          goToCurrent: false,
          goToNext: false,
          goToPrev: false,
          index: index + 1 === this.props.slides.length ? 0 : index + 1
        });
      }, 100);
    } else if (abs < -50) {
      this.setState({
        goToCurrent: false,
        goToNext: false,
        goToPrev: true,
      });
      setTimeout(() => {
        this.setState({
          goToCurrent: false,
          goToNext: false,
          goToPrev: false,
          index: index - 1 < 0 ? this.props.slides.length - 1 : index - 1
        });
      }, 100);
    } else {
      this.setState({
        goToCurrent: true,
        goToNext: false,
        goToPrev: false,
      });
      setTimeout(() => {
        this.setState({
          goToCurrent: false,
          goToNext: false,
          goToPrev: false,
        });
      }, 100);
    }
  }

  render() {
    const {
      handleSwiping,
      handleSwiped,
      handleSwipingLeft,
      handleSwipedLeft,
      handleSwipingRight,
      handleSwipedRight,
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
      }
    } = this;
    let firstSlideStyle;
    let secondSlideStyle;
    let thirdSlideStyle;
    firstSlideStyle = secondSlideStyle = thirdSlideStyle = {};
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
    const nextIndex = index + 1 === this.props.slides.length ? 0 : index + 1;
    return (
      <Modal
        isOpen
        onRequestClose={handleRequestClose}
        style={MODAL_STYLES}
      >
        <Swipeable
          onSwiping={handleSwiping}
          onSwiped={handleSwiped}
          onSwipingLeft={handleSwipingLeft}
          onSwipedLeft={handleSwipedLeft}
          onSwipingRight={handleSwipingRight}
          onSwipedRight={handleSwipedRight}
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

        </Swipeable>

      </Modal>

    );
  }
}
