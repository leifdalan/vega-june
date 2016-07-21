import { createSelector } from 'reselect';

const SET_BROWSER = 'SET_BROWSER';
const SET_SCROLL = 'SET_SCROLL';
const SET_WINDOW = 'SET_WINDOW';

const initialState = {
  scroll: {
    x: 0,
    y: 0,
  },
  window: {
    height: 0,
    width: 0,
    docHeight: 0
  }
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_BROWSER:
      return {
        ...state,
        ...action.payload
      };
    case SET_SCROLL:
      return {
        ...state,
        scroll: action.payload
      };
    case SET_WINDOW:
      return {
        ...state,
        window: action.payload
      };

    default:
      return state;
  }
}

export function setBrowser() {
  return {
    type: SET_BROWSER,
    payload: window.navigator,
  };
}

export function setWindow() {
  return {
    type: SET_WINDOW,
    payload: {
      height: window.innerHeight,
      width: window.innerWidth,
      docHeight: window.document.body.clientHeight
    },
  };
}

export function setScroll() {
  return dispatch => {
    dispatch(setWindow());
    return dispatch({
      type: SET_SCROLL,
      payload: {
        x: window.scrollX,
        y: window.scrollY
      },
    });
  }
}

export const getDistanceFromBottomSelector = createSelector(
  state => state.browser.window,
  state => state.browser.scroll, (
    windowState,
    scrollState,
  ) => windowState.docHeight - windowState.height - scrollState.y
);
