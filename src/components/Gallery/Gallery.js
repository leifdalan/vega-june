import React, { Component, PropTypes as pt } from 'react';
import { connect } from 'react-redux';
import { mapStateToProps } from 'containers/Archive/ArchiveSelectors';
import ReactSwipe from 'react-swipe';
import Modal from 'react-modal';
const MODAL_STYLES = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  },
  content: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    border: 'none',
    background: 'transparent',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    borderRadius: '0',
    outline: 'none',
    padding: '2px'

  }
};

@connect(mapStateToProps, {})
export default class Gallery extends Component {
  static propTypes = {
    history: pt.object.isRequired,
    params: pt.object.isRequired,
    slides: pt.array.isRequired
  }

  handleRequestClose = () => this.props.history.goBack()

  render() {
    console.error('this.props', this.props);
    return (
      <Modal
        isOpen
        onRequestClose={this.handleRequestClose}
        style={MODAL_STYLES}
      >
        <ReactSwipe
          className="carousel"
          swipeOptions={{
            continuous: true,
            startSlide: this.props.params.index
          }}
        >
          {this.props.slides.map((url, index) => <img key={index} alt={index} src={url} />)}
        </ReactSwipe>
      </Modal>

    );
  }
}
