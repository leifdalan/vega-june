import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as reduxAsyncConnect } from 'redux-async-connect';
import { reducer as form } from 'redux-form';
import auth from './auth';
import notifs from './notifs';
import tumblr from './tumblr';
import browser from './browser';
import progress from './progress';
import cache from './cache';
import youtube from './youtube';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  notifs,
  form,
  auth,
  tumblr,
  browser,
  progress,
  cache,
  youtube,
});
