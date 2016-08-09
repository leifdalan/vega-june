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
