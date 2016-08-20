import { PropTypes } from 'react';
import { createSelector } from 'reselect';
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
import {
  getTagsSelector,

} from 'redux/modules/info';

export const mapStateToProps = createSelector(
  state => state.notifs,
  state => state.auth.user,
  state => state.auth.socket,
  state => state.auth.nsp,
  state => state.reduxAsyncConnect.loaded, (
    notifs,
    user,
    socket,
    nsp,
    pageLoaded,
  ) => ({
    notifs,
    user,
    socket,
    nsp,
    pageLoaded,
  })
);

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
