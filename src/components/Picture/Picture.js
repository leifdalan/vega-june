import React, { PropTypes as pt, Component } from 'react';
import { BACKGROUND_PLACEHOLDER } from './Picture.style';

export default class Picture extends Component {
  state = {
    isLoaded: false,
  }

  componentDidMount() {
    this.loadSrc(this.props.src);
  }

  componentDidUpdate(prevProps) {
    if (this.props.src !== prevProps.src) {
      if (!this.refs.img || !this.refs.img.complete) {
        this.loadSrc(this.props.src);
      }
    }
  }

  loadSrc = (src) => {
    console.log('loading src')
    this.setState({
      isLoaded: false,
    });
    this.image = new Image();
    this.image.src = src;
    this.image.onload = () => this.setState({
      isLoaded: true,
    });
  }


  render() {
    const {
      props: {
        ratio,
        style,
        src,
      },
      state: {
        isLoaded,
      },
    } = this;

    return (
      <figure
        style={{
          paddingBottom: `${ratio * 100}%`,
          position: 'relative',
          width: '100%',
          display: 'block',
          lineHeight: 0,
          ...BACKGROUND_PLACEHOLDER,
          ...style,
        }}
        >
        {isLoaded &&
          <img
            ref="img"
            src={src}
            alt={'balls'}
            style={{
              width: '100%',
              display: 'block',
              position: 'absolute',
              height: '100%',
            }}
            />
        }
      </figure>
    );
  }
}

Picture.propTypes = {
  src: pt.string,
  alt: pt.string,
  ratio: pt.number,
  style: pt.object
};
