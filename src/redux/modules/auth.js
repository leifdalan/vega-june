import { createSelector } from 'reselect';
import { replace, push } from 'react-router-redux';
import get from 'lodash/get';
const LOAD = 'redux-example/auth/LOAD';
const LOAD_SUCCESS = 'redux-example/auth/LOAD_SUCCESS';
const LOAD_FAIL = 'redux-example/auth/LOAD_FAIL';
const LOGIN = 'redux-example/auth/LOGIN';
const LOGIN_SUCCESS = 'redux-example/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'redux-example/auth/LOGIN_FAIL';
const REGISTER = 'redux-example/auth/REGISTER';
const REGISTER_SUCCESS = 'redux-example/auth/REGISTER_SUCCESS';
const REGISTER_FAIL = 'redux-example/auth/REGISTER_FAIL';
const LOGOUT = 'redux-example/auth/LOGOUT';
const LOGOUT_SUCCESS = 'redux-example/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'redux-example/auth/LOGOUT_FAIL';
const SET_SOCKET = 'redux-example/auth/SET_SOCKET';
const SET_SOCKET_NSP = 'redux-example/auth/SET_SOCKET_NSP';

const initialState = {
  loaded: false,
  socket: {},
  nsp: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.result
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        user: action.result
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error
      };
    case REGISTER:
      return {
        ...state,
        registeringIn: true
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registeringIn: false
      };
    case REGISTER_FAIL:
      return {
        ...state,
        registeringIn: false,
        loginError: action.error
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    case SET_SOCKET:
      return {
        ...state,
        socket: action.payload
      };
    case SET_SOCKET_NSP:
      return {
        ...state,
        nsp: action.payload
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.loaded;
}

export function setSocket(socket) {
  return {
    type: SET_SOCKET,
    payload: socket,
  };
}

export function setSocketNsp(socket) {
  return {
    type: SET_SOCKET,
    payload: socket,
  };
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/auth/load')
  };
}

export function register(data) {
  return {
    types: [REGISTER, REGISTER_SUCCESS, REGISTER_FAIL],
    promise: (client) => client.post('/auth/register', { data })
  };
}

export function login(data) {
  return (dispatch, getState) => dispatch({
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/auth/login', { data })
  }).then((res) => {
    const {
      routing: {
        locationBeforeTransitions: {
          query: {
            r: redirect
          }
        }
      }
    } = getState();
    const actualRedirect = redirect === '/login'
      ? '/'
      : redirect
        ? redirect
        : '/';
    dispatch(replace(actualRedirect));
    return res;
  });
}

export function logout() {
  return dispatch => dispatch({
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.get('/auth/logout')
  }).then(() => dispatch(replace('/login')));
}

export const userSelector = createSelector(
  state => state,
  state => get(state, 'auth.user')
);
