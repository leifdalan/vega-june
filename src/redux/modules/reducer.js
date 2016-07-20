import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-connect';
import { reducer as form } from 'redux-form';
import auth from './auth';
import notifs from './notifs';
import info from './info';
import browser from './browser';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  notifs,
  form,
  auth,
  info,
  browser
});
