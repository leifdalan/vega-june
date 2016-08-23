import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';

// export default (store) => {
export default store => {
  function checkAuth(logged, replace, cb) {
    const {
      auth: {
        user
      },
      routing: {
        locationBeforeTransitions: {
          pathname
        }
      }
    } = store.getState();

    console.error('user in checkAuth', store.getState());
    if (!!user === !logged) replace('/');
    if (!user) {
      store.dispatch({
        type: 'REDIRECT_BACK',
        payload: pathname
      });
      replace(`/login?r=${pathname}`);
    }
    cb();
  }

  const requireLogin = (nextState, replace, cb) => {
    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(() => checkAuth(true, replace, cb));
    } else {
      checkAuth(true, replace, cb);
    }
  };
  //
  // const requireNotLogged = (nextState, replace, cb) => {
  //   if (!isAuthLoaded(store.getState())) {
  //     store.dispatch(loadAuth()).then(() => checkAuth(false, replace, cb));
  //   } else {
  //     checkAuth(false, replace, cb);
  //   }
  // };
  /**
   * Please keep routes in alphabetical order
   */
  // const syncLoad = (typeof require.ensure !== 'function' || __DEVELOPMENT__);
  // return (
  //   <Route path="/" component={require('./containers/App/App')}>
  //     {/* Home (main) route */}
  //     <IndexRoute component={require('./containers/Home/Home')} />
  //
  //     {/* Routes disallow login */}
  //     <Route path="*" component={require('./containers/NotFound/NotFound')} status={404} />
  //   </Route>
  // );
  // if (typeof require.ensure !== 'function' || __DEVELOPMENT__) require.ensure = (deps, cb) => cb(require);
  // return {
  //   path: '/',
  //   component: require('./containers/App/App'),
  //   indexRoute: {
  //     component: require('./containers/Home/Home')
  //   },
  //   childRoutes: [{
  //     path: 'login',
  //     getComponent(nextState, cb) {
  //       console.time('gettingComponent');
  //       store.dispatch({
  //         type: 'WEBPACK_LOAD'
  //       });
  //       require.ensure([], (require) => {
  //         cb(null, require('./containers/Login/Login'));
  //         store.dispatch({
  //           type: 'WEBPACK_LOAD_END'
  //         });
  //         console.timeEnd('gettingComponent');
  //       });
  //     }
  //
  //   }, {
  //     path: 'about',
  //     getComponent(nextState, cb) {
  //       console.time('gettingComponent');
  //       store.dispatch({
  //         type: 'WEBPACK_LOAD'
  //       });
  //       require.ensure([], (require) => {
  //         cb(null, require('./containers/About/About'));
  //         store.dispatch({
  //           type: 'WEBPACK_LOAD_END'
  //         });
  //         console.timeEnd('gettingComponent');
  //       });
  //     }
  //
  //   }, {
  //     path: 'survey',
  //     getComponent(nextState, cb) {
  //       require.ensure([], (require) =>
  //         cb(null, require('./containers/Survey/Survey')));
  //     }
  //   }, {
  //     path: 'widgets',
  //     getComponent(nextState, cb) {
  //       store.dispatch({
  //         type: 'WEBPACK_LOAD'
  //       });
  //       require.ensure([], (require) => {
  //         cb(null, require('./containers/Widgets/Widgets'));
  //         store.dispatch({
  //           type: 'WEBPACK_LOAD_END'
  //         });
  //       });
  //     }
  //   }, {
  //     onEnter: requireLogin,
  //     childRoutes: [
  //       {
  //         path: 'chat',
  //         getComponent(nextState, cb) {
  //           require.ensure([], (require) =>
  //             cb(null, require('./containers/Chat/Chat')));
  //         }
  //       },
  //       {
  //         path: 'loginSuccess',
  //         getComponent(nextState, cb) {
  //           require.ensure([], (require) =>
  //             cb(null, require('./containers/LoginSuccess/LoginSuccess')));
  //         }
  //       }
  //     ]
  //   }, {
  //     path: '*',
  //     getComponent(nextState, cb) {
  //       require.ensure([], (require) =>
  //         cb(null, require('./containers/NotFound/NotFound')));
  //     }
  //   }]
  // };
// };
//
  return <Route path="/" component={require('./containers/App/App')}>
    {/* Home (main) route */}
    <IndexRoute onEnter={requireLogin} component={require('./containers/Home/Home')} />
    <Route onEnter={requireLogin} path="gallery" component={require('./containers/Home/Home')}>
      <Route path=":index" component={require('./components/Gallery/Gallery')} />
    </Route>
    <Route onEnter={requireLogin} path="/archive" components={{
        content: require('./containers/Archive/Archive'),
        sidebar: require('./components/Sidebar')
      }}>
      <Route path="tag/:id">
        <Route path="gallery/:index" component={require('./components/Gallery/Gallery')} />
      </Route>
      <Route path="gallery/:index" component={require('./components/Gallery/Gallery')} />
    </Route>
    <Route path="login" component={require('./containers/Login/Login')} />
    {/* Routes disallow login */}
    <Route path="*" component={require('./containers/NotFound/NotFound')} status={404} />
  </Route>
};
