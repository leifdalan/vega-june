import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';
import { reducer as form } from 'redux-form';
import auth from './auth';
import notifs from './notifs';
import info from './info';
import browser from './browser';
import progress from './progress';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  notifs,
  form,
  auth,
  info,
  browser,
  progress
});
