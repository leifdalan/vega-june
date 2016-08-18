import superagent from 'superagent';
// import config from 'config';
export const testUrl = `http://fartsz.com`;
const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  if (__SERVER__) {
    const config = require('config');
    // Prepend host and port of the API server to the path.
    return `http://${config.apiHost}:${config.apiPort + adjustedPath}`;
  } else if (__TEST__) {
    return `${testUrl}${adjustedPath}`;
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return `/api${adjustedPath}`;
}

export default class ApiClient {
  constructor(req) {
    methods.forEach(method => {
      this[method] = (path, { params, data, headers, files, fields } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));
        if (params) {
          request.query(params);
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'));
        }

        if (headers) {
          request.set(headers);
        }

        if (this.socketHeader) {
          request.set('X-Socket-id', `${this.socketHeader}`);
        }

        if (this.token) {
          request.set('Authorization', `JWT ${this.token}`);
        }

        if (files) {
          files.forEach(file => request.attach(file.key, file.value));
        }

        if (fields) {
          fields.forEach(item => request.field(item.key, item.value));
        }
        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => {
          return (err ? reject(body || err) : resolve(body));
        });
      });
    });
  }

  setJwtToken(token) {
    this.token = token;
  }
  setSocketHeader(id) {
    this.socketHeader = id;
  }
}
