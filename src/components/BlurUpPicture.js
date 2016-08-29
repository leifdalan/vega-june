import React, { Component, PropTypes as pt } from 'react';
import Picture from 'components/Picture';
export default class BlurUp extends Component {
  constructor(args) {
    super(...args);
  }

  state = {
    imageLoaded: false
  }

  componentWillMount() {
    this.finalImage = new Image();
    this.finalImage.src = this.props.src;
    this.finalImage.onLoad = this.onImageLoad;
  }

  onImageLoad = () => setTimeout(() => this.setState({
    imageLoaded: true
  }), 500)

  render() {
    const {
      state: {
        imageLoaded
      },
      props: {
        ratio,
        src,
        previewSrc
      }
    } = this;

    return (
      <Picture

      />
    )
  }
}
