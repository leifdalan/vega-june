import tumblrClient from '../tumblrClient';
import youtube from '../youtubeClient';
import range from 'lodash/range';
import without from 'lodash/without';
import map from 'lodash/map';
import toNumber from 'lodash/toNumber';
import { redisClient } from '../api';
import config from 'config';
const playlist = config.youtubePlaylistId;
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
  console.log('loadingall!!!');
  return new Promise((masterResolve) => {
    const multi = redisClient.multi();
    multi.get('latestTumblr');
    multi.get('latestYoutube');

    multi.exec( (err, [data, youtube]) => {

      const tumblrPromise = new Promise((tumblrResolve, tumblrReject) => {
        if (data) {
          console.log('resolving data');
          return tumblrResolve(JSON.parse(data));
        } else {
          fetchAllPostsFromTumblr(req).then((tumblrData) => {
            redisClient.set('latestTumblr', JSON.stringify(tumblrData), (setErr, setData) => {
              console.log('setData', setData);
              tumblrResolve(tumblrData);
            });
          });
        }
      }).catch(console.log);
      const youtubePromise = new Promise((youtubeResolve, youtubeReject) => {
        if (youtube) {
          console.log('resolving data');
          return youtubeResolve(JSON.parse(youtube));
        } else {
          fetchAllYoutubeVideos().then((youtubeData) => {
            redisClient.set('latestYoutube', JSON.stringify(youtubeData), (setErr, setData) => {
              console.log('setData', setData);
              youtubeResolve(youtubeData);
            });
          });
        }
      }).catch(console.log);
      return Promise.all([tumblrPromise, youtubePromise]).then(([tumblr, youtube]) => {
        masterResolve(tumblr);
      }).catch(console.log);
    });
      // console.error('data, youtube', youtube);

    // }).catch(console.log);
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

export function fetchAllYoutubeVideos() {
  return new Promise((resolve, reject) => {
    youtube.playlistItems.list({
      part: 'contentDetails',
      playlistId: 'PLDxchoMUm8NhAkt6c0pkdowAunWUaq_f8',
      mine: true,
    }, (err, res) => {
      if (err) {
        reject(err);
      }
      const ids = [];
      res.items.forEach((item) => ids.push(item.contentDetails.videoId));
      console.error('ids', ids);
      youtube.videos.list({
        part: 'contentDetails,snippet,fileDetails,processingDetails,player',
        id: ids.join(','),
      }, (err, res) => {
        if (err) {
          reject(err);
        }
        console.error('err', err);
        console.error('res', res);
        redisClient.set('latestYoutube', JSON.stringify(res), (setErr, setData) => {
          console.log('setData', setData);
          resolve(res);
        });


        res.items.forEach(item => {
          console.error('item.snippet', item.snippet);
          console.error('item.contentDetails', item.contentDetails);
          console.error('item.fileDetails', item.fileDetails);
          console.error('item.processingDetails', item.processingDetails);
          console.error('item.player', item.player);
        });
      });
    });
  }).catch(console.log);
}
