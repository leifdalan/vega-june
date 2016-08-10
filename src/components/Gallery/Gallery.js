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

@withRouter
@connect(mapStateToProps, {})
export default class Gallery extends Component {

  static propTypes = {
    history: pt.object.isRequired,
    params: pt.object.isRequired,
    slides: pt.array.isRequired,
    router: pt.object.isRequired,
  }

  handleRequestClose = () => this.props.router.goBack()

  render() {
    const {
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
        <figure style={IMG_CONTAINER_STYLES}>
          <img
            src={slides[index]}
            alt={'something'}
            style={IMG_STYLES}
            onClick={handleRequestClose}
          />
        </figure>

      </Modal>

    );
  }
}
