import { createSelector } from 'reselect';

const SET_BROWSER = 'SET_BROWSER';
const SET_SCROLL = 'SET_SCROLL';
const SET_WINDOW = 'SET_WINDOW';
const SET_CONTAINER_WIDTH = 'SET_CONTAINER_WIDTH';
const SET_FEATURE = 'SET_FEATURE';

const initialState = {
  scroll: {
    x: 0,
    y: 0,
  },
  containerWidth: 0,
  window: {
    height: 0,
    width: 768,
    docHeight: 0
  },
  feature: {
    hasTouch: false,
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
    case SET_CONTAINER_WIDTH:
      return {
        ...state,
        containerWidth: action.payload
      };
    case SET_FEATURE:
      return {
        ...state,
        feature: {
          ...state.feature,
          ...action.payload,
        }
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

export function setTouch() {
  return {
    type: SET_FEATURE,
    payload: {
      hasTouch: 'ontouchstart' in window,
    },
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

export function setContainerWidth(payload = 0) {
  return {
    type: SET_CONTAINER_WIDTH,
    payload,
  };
}


export function setScroll() {
  return dispatch => {
    // dispatch(setWindow());
    return dispatch({
      type: SET_SCROLL,
      payload: {
        x: window.scrollX,
        y: window.scrollY
      },
    });
  };
}

export const getBrowserDimensionSelector = createSelector(
  state => state.browser.window.width,
  width => width
);

export const getBrowserHeightSelector = createSelector(
  state => state.browser.window.height,
  height => height
);

export const getContainerWidthSelector = createSelector(
  state => state.browser.containerWidth,
  containerWidth => containerWidth
);

export const getTouchSelector = createSelector(
  state => state.browser.feature.hasTouch,
  touch => touch
);

export const getDistanceFromBottomSelector = createSelector(
  state => state.browser.window,
  state => state.browser.scroll, (
    windowState,
    scrollState,
  ) => windowState.docHeight - windowState.height - scrollState.y
);
