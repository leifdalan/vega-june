import tumblrClient from '../tumblrClient';

export default function loadInfo(req) {
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
