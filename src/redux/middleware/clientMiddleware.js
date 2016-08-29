import { ADD_CACHE } from '../modules/cache';
export default function clientMiddleware(client) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }

    const { promise, types, cache, ...rest } = action; // eslint-disable-line no-redeclare
    if (!promise) {
      return next(action);
    }

    const [REQUEST, SUCCESS, FAILURE] = types;
    next({ ...rest, type: REQUEST });

    const {
      auth,
      cache: cacheState
    } = getState();

    client.setJwtToken(auth.user && auth.user.token ? auth.user.token : null);
    client.setSocketHeader(auth.socket && auth.socket.id ? auth.socket.id : null);

    // // Skip API call if it has been designated as a cache call
    //
    // const cachedCall = cacheState[cache && cache.key];
    // if (cachedCall) {
    //   const ttl = cachedCall || Infinity;
    //   console.error('new Date() - cachedCall.time < ttl', new Date() - new Date(cachedCall.time), ttl);
    //   return Promise.resolve();
      // if (new Date() - new Date(cachedCall.time) < ttl) {
      //   console.error('%c its cached!!!', 'font-size: 56px');
      //
      // }
    }

    const actionPromise = promise(client);
    actionPromise.then(
      // (result) => {
      //   if (cache) {
      //     next({
      //       type: ADD_CACHE,
      //       payload: {
      //         key: cache.key,
      //         time: new Date(),
      //         ttl: cache.ttl
      //       }
      //     });
      //   }
        return next({ ...rest, result, type: SUCCESS });
      },
      (error) => next({ ...rest, error, type: FAILURE })
    ).catch((error) => {
      console.error('MIDDLEWARE ERROR:', error);
      next({ ...rest, error, type: FAILURE });
    });

    return actionPromise;
  };
}
