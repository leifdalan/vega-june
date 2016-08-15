import { PropTypes } from 'react';

import {
  logout,
  setSocket,
  setSocketNsp
} from 'redux/modules/auth';
import {
  setBrowser,
  setScroll,
  setWindow
} from 'redux/modules/browser';
import { push } from 'react-router-redux';

export const mapStateToProps = state => ({
  notifs: state.notifs,
  user: state.auth.user,
  socket: state.auth.socket,
  nsp: state.auth.nsp,
  pageLoaded: state.reduxAsyncConnect.loaded
});

export const boundActions = {
  logout,
  pushState: push,
  setSocket,
  setSocketNsp,
  setBrowser,
  setScroll,
  setWindow,
};

export const propTypes = {
  children: PropTypes.object.isRequired,
  user: PropTypes.object,
  notifs: PropTypes.object,
  location: PropTypes.object,
  logout: PropTypes.func.isRequired,
  pushState: PropTypes.func.isRequired,
  setSocket: PropTypes.func.isRequired,
  setSocketNsp: PropTypes.func.isRequired,
  setBrowser: PropTypes.func.isRequired,
  setScroll: PropTypes.func.isRequired,
  setWindow: PropTypes.func.isRequired,
  pageLoaded: PropTypes.bool.isRequired,
};
