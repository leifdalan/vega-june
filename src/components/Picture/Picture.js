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

  componentWillUnmount() {
    this.image.onload = () => {};
  }

  onLoad = () => {
    this.setState({
      isLoaded: true,
    });
  }

  loadSrc = src => {
    this.setState({
      isLoaded: false,
    });
    this.image = new Image();
    this.image.src = src;
    this.image.onload = this.onLoad;
  }

  render() {
    const {
      props: {
        ratio,
        style,
        src,
        isInPortraitContainer,
      },
      state: {
        isLoaded,
      },
    } = this;

    const ratioStyle = isInPortraitContainer ? {
      paddingBottom: `${ratio * 100}%`,
      width: '100%',
    } : {
      paddingLeft: `${(1 / ratio) * 100}%`,
      height: '100%',
    };

    return (
      <figure
        style={{
          ...ratioStyle,
          position: 'relative',
          display: 'block',
          lineHeight: 0,
          ...BACKGROUND_PLACEHOLDER,
          ...style,
        }}
        >
          <div
            style={{
              width: '100%',
              display: 'block',
              position: 'absolute',
              height: '100%',
              opacity: isLoaded ? 1 : 0,
              top: 0,
              left: 0,
              transition: 'opacity 0.3s ease-out'
            }}
          >
          {isLoaded &&
            <img
              ref="img"
              src={src}
              alt={'balls'}
              style={{
                width: '100%',
                height: '100%',
              }}

              />
          }
          </div>
      </figure>
    );
  }
}

Picture.propTypes = {
  src: pt.string,
  alt: pt.string,
  ratio: pt.number,
  style: pt.object,
  isInPortraitContainer: pt.bool,
};

Picture.defaultProps = {
  isInPortraitContainer: true,
};
