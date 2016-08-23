import tumblrClient from '../tumblrClient';
import range from 'lodash/range';
import without from 'lodash/without';
import map from 'lodash/map';
import toNumber from 'lodash/toNumber';

export function loadInfo(req) {
  const offset = req && req.query && req.query.offset
    ? req.query.offset
    : 0;
  return new Promise((resolve, reject) => {
    tumblrClient.blogPosts('vega-june.tumblr.com', {
      limit: 20,
      offset: offset * 20,
    }, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

export function loadAll(req) {
  return new Promise((masterResolve, masterReject) => {
    const pages = req && req.query && req.query.pages
      ? map(req.query.pages.split(','), toNumber)
      : -1;
    const totalPosts = req && req.query && req.query.totalPosts
      ? req.query.totalPosts
      : null;
    const firstPromise = totalPosts
      ? Promise.resolve(totalPosts)
      : new Promise((resolve, reject) => {
        console.error('gettingFirstPage');
        tumblrClient.blogPosts('vega-june.tumblr.com', {
          limit: 20,
        }, (err, data) => {
          if (err) return reject(err);
          return resolve(data.blog.posts);
        });
      });
    firstPromise.then((promiseResponse) => {
      console.error('promiseResponse', promiseResponse);
      const pagesNeeded = Math.floor(promiseResponse / 20);
      console.error('pagesNeeded', pagesNeeded);
      console.error('pages', pages);
      const allPagesNeededFetch = without(range(pagesNeeded), ...pages);
      return Promise.all(
        allPagesNeededFetch.reduce((out, page) => [
          ...out,
          new Promise((resolve, reject) => {
            console.log('getting page', page);
            tumblrClient.blogPosts('vega-june.tumblr.com', {
              limit: 20,
              offset: 20 * page
            }, (err, data) => {
              if (err) return reject(err);
              return resolve(data);
            });
          })
        ], [])
      ).then(resultArray => {
        masterResolve(resultArray);
      }).catch((err) => {
        masterReject(err);
      });
    });
  }).catch(err => console.error(err));
}
