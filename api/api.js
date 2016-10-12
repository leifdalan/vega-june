import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from 'config';
// import apiConfig from './config';
import * as actions from './actions';
import { mapUrl } from './utils/url.js';

import passport from 'passport';
import * as helpers from './helpers';
// import * as database from './database';
import connectRedis from 'connect-redis';
// const { auth } = helpers;
import redis from 'redis';

const RedisStore = connectRedis(session);

const app = express();
export const redisClient = redis.createClient(config.redisUrl);

// const io = new SocketIo(server);
// io.path('/ws');
const {
  redisSecret,
} = config;

// auth.initialize(authSecret);
app.use(morgan('dev'));
app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: redisSecret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365
  }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res) => {
  const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

  const { action, params } = mapUrl(actions, splittedUrlPath);
  if (action) {
    action(req, params, { ...helpers })
    .then((result) => {
      if (result instanceof Function) {
        result(res);
      } else {
        res.json(result);
      }
    }, (reason) => {
      if (reason && reason.redirect) {
        res.redirect(reason.redirect);
      } else {
        res.status(reason.status || 500).json(reason);
      }
    });
  } else {
    res.status(404).end('NOT FOUND');
  }
});


if (config.apiPort) {
  app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });
} else {
  console.error('==>     ERROR: No APIPORT environment variable has been specified');
}
