import tumblrClient from '../tumblrClient';
import range from 'lodash/range';
import without from 'lodash/without';
import map from 'lodash/map';
import toNumber from 'lodash/toNumber';
import { redisClient } from '../api';
// import redis from 'redis';

// function getBlogPostsPromise({ limit = 20, offset }) {
//   return new Promise((resolve, reject) => {
//     tumblrClient.blogPosts('vega-june.tumblr.com', {
//       limit,
//       offset: offset * 20,
//     }, (err, data) => {
//       if (err) reject(err);
//       resolve(data);
//     });
//   });
// }
//
// function getRedisMultiPromise(multi) {
//   return new Promise((resolve, reject) => {
//     multi.exec((err, data) => {
//       if (err) reject(err);
//       resolve(data);
//     });
//   });
// }
//
// function superagentGetPromise(superAgent) {
//   return new Promise((resolve, reject) => {
//     superAgent.end((err, data) => {
//       if (err) reject(err);
//       resolve(data);
//     });
//   });
// }
//
// function mapTumblrToIds(tumblrData) {
//   const multi = redisClient.multi();
//   const ids = map(tumblrData.posts, ({ id, type, photos, thumbnail_url }) => {
//     multi.get(id);
//     const url = type === 'video'
//       ? thumbnail_url
//       : photos[0].alt_sizes[5].url
//     return { id, url };
//   });
// }


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
  return new Promise((resolve) => {
    redisClient.get('latestTumblr', (err, data) => {
      if (data) {
        console.log('resolving data');
        return resolve(JSON.parse(data));
      }
      fetchAllPostsFromTumblr(req).then((tumblrData) => {
        redisClient.set('latestTumblr', JSON.stringify(tumblrData), (setErr, setData) => {
          console.log('setData', setData);
          resolve(tumblrData);
        });

      });
    });
  });
}

export function fetchAllPostsFromTumblr(req) {
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
        tumblrClient.blogPosts('vega-june.tumblr.com', {
          limit: 20,
        }, (err, data) => {
          if (err) return reject(err);
          return resolve(data.blog.posts);
        });
      });
    firstPromise.then((promiseResponse) => {
      const pagesNeeded = Math.floor(promiseResponse / 20 + 1);
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
        redisClient.set('latestTumblr', JSON.stringify(resultArray), (setErr, setData) => {
          console.log('setData', setData);
          masterResolve(resultArray);
        });
      }).catch((err) => {
        masterReject(err);
      });
    });
  }).catch(err => console.error(err));
}
