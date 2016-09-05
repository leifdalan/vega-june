import React, { Component, PropTypes as pt } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from 'containers/Archive/ArchiveSelectors';
// import ReactSwipe from 'react-swipe';
import Modal from 'react-modal';
import { withRouter } from 'react-router';
import {
  MODAL_STYLES,
  IMG_STYLES,
  IMG_CONTAINER_STYLES,
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

  state = {
    left: 0
  }

  handleRequestClose = () => this.props.router.goBack()

  handleSwipingLeft = (e, abs) => {
    console.error('e', abs);
    this.setState({
      left: abs
    })
  }

  handleSwipedLeft = (a, b, c, d) => {
    console.log(a,b,c,d)
  }

  render() {
    const {
      handleSwipingLeft,
      handleSwipedLeft,
      handleRequestClose,
      props: {
        params: {
          index,
        },
        slides
      }
    } = this;
    return (
      <Modal
        isOpen
        onRequestClose={handleRequestClose}
        style={MODAL_STYLES}
      >
        <Swipeable
          onSwipingLeft={handleSwipingLeft}
          onSwipedLeft={handleSwipedLeft}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%'
          }}
        >
          <figure style={IMG_CONTAINER_STYLES}>
            <img
              src={slides[index-1]}
              alt={'something'}
              style={{
                ...IMG_STYLES,
                left: -this.state.left
              }}
              onClick={handleRequestClose}
              />
          </figure>

          <figure style={IMG_CONTAINER_STYLES}>
            <img
              src={slides[index]}
              alt={'something'}
              style={{
                ...IMG_STYLES,
                left: -this.state.left
              }}
              onClick={handleRequestClose}
              />
          </figure>

          <figure style={IMG_CONTAINER_STYLES}>
            <img
              src={slides[index + 1]}
              alt={'something'}
              style={{
                ...IMG_STYLES,
                left: -this.state.left
              }}
              onClick={handleRequestClose}
              />
          </figure>

        </Swipeable>

      </Modal>

    );
  }
}
