import React, { PropTypes as pt } from 'react';
import { BACKGROUND_PLACEHOLDER } from './Picture.style';

export default function Picture({ src, ratio, style }) {
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
      {src &&
        <img
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

Picture.propTypes = {
  src: pt.string,
  alt: pt.string,
  ratio: pt.number,
  style: pt.object
};
