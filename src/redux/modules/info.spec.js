import test from 'ava';
// import reducer from './reducer';
import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import ApiClient, { testUrl } from '../../helpers/ApiClient';
import createMiddleware from '../middleware/clientMiddleware';

const client = new ApiClient();
import {
  LOAD,
  LOAD_SUCCESS,
  LOAD_FAIL,
  load
} from './info';

test('load() calls the correct actions with correct data', t => {
  return new Promise((resolve, reject) => {
    const data = [{ id: 1 }, { id: 2 }];
    const mockStore = configureStore([thunkMiddleware, createMiddleware(client)]);
    const store = mockStore({ auth: {}, info: {pages: {}} });
    const expectedActions = [{
      page: 0,
      type: LOAD
    }, {
      page: 0,
      type: LOAD_SUCCESS,
      result: data
    }];
    nock(testUrl)
      .get('/loadInfo/?offset=0')
      .reply(200, data);
    store.dispatch(load())
      .then(() => {
        t.deepEqual(store.getActions(), expectedActions);
        resolve();
      });
  });
});

// test('bar', async t => {
//   const bar = Promise.resolve('bar');
//
//   t.is(await bar, 'bar');
// });
