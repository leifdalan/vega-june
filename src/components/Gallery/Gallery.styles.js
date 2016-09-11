import {
  BACKGROUND_PLACEHOLDER
} from '../Picture/Picture.style';

export const MODAL_STYLES = {
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

export const IMG_CONTAINER_STYLES = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  perspective: '1000px',
  transformOrigin: 'left',
  backfaceVisbility: 'none'
};

export const IMG_STYLES = {
  background: `rgba(255,255,255,.3) ${BACKGROUND_PLACEHOLDER.background}`,
  maxHeight: '100%',
  maxWidth: '100%',
  position: 'relative',
  transformOrigin: 'left center 0px',
  perspective: '1000px',
};

export const IMG_TRANSFORM_NEXT = {
  transitionProperty: 'transform3d',
  transitionDuration: '1s',
  transform3d: 'rotateY(-90deg)'
};

export const FIGURE_SWIPELEFT = {
  transitionProperty: 'transform',
  transitionDuration: '1s',
  transform: 'rotateY(-90deg)'
};

export const NEXT_IMG_CONTAINER = {
  display: 'inherit',
};

export const NEXT_IMG_CONTAINER_TRANSITION = {
  transitionProperty: 'transform',
  transitionDuration: '1s',
  transform: 'scale(1)'
}

export const PREV_IMG_CONTAINER_TRANSITION = {
  transitionProperty: 'transform',
  transitionDuration: '1s',
  transform: 'rotateY(0deg)'
};

export const GO_TO_THIRD_TRANSITION = {
  transitionProperty: 'transform',
  transitionDuration: '1s',
  transform: 'rotateY(90deg)',
};

export const PREV_DEFAULT = {
  transform: 'rotateY(-110deg)',
};

export const CURRENT_DEFAULT = {
  transform: 'rotateY(0deg)'
};

export const NEXT_DEFAULT = {
  transform: 'rotateY(110deg)',
};

export const SUMMARY_STYLES = {
  bottom: 30,
  textAlign: 'center',
  background: 'rgba(0,0,0, .6)',
  color: 'white',
  display: 'inline-block',
  zIndex: 3,
  padding: 10,
  borderRadius: 10
};

export const SUMMARY_CONTAINER_STYLES = {
  position: 'absolute',
  bottom: 30,
  zIndex: 3,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  display: 'flex',
  transition: 'opacity 0.4s ease-out, bottom 0.4s ease-out'
};
