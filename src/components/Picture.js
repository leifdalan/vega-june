import React, { PropTypes as pt } from 'react';

export default function Picture({ src, ratio, style }) {
  return (
    <figure
      style={{
        paddingBottom: `${ratio * 100}%`,
        position: 'relative',
        background: 'blue',
        width: '100%',
        display: 'block',
        lineHeight: 0,
        ...style,
      }}
    >
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
    </figure>
  );
}

Picture.propTypes = {
  src: pt.string.required,
  alt: pt.string,
  ratio: pt.number.required,
  style: pt.object
};
