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
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const IMG_STYLES = {
  maxHeight: '100%',
  maxWidth: '100%'
};
