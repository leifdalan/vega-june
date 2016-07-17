import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from 'config';
// import apiConfig from './config';
import * as actions from './actions';
import { mapUrl } from './utils/url.js';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';
import passport from 'passport';
import * as helpers from './helpers';
// import * as database from './database';
import connectRedis from 'connect-redis';
// const { auth } = helpers;
import redis from 'redis';
console.error('co', config);
const RedisStore = connectRedis(session);
const pretty = new PrettyError();
const app = express();
var redisClient = redis.createClient(config.REDIS_URL);
const server = new http.Server(app);

const io = new SocketIo(server);
io.path('/ws');
const {
  authSecret,
  redisSecret,
  redisHost,
  redisPort,
  redisDb,
  redisPass
} = config;

// auth.initialize(authSecret);
console.error('redisSecret', redisSecret);
console.error('redisHost', redisHost);
console.error('redisPort', redisPort);
app.use(morgan('dev'));
app.use(session({
  store: new RedisStore({
    client: redisClient
  }),
  secret: redisSecret,
  resave: true,
  saveUninitialized: true,
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
        console.error('API ERROR:', pretty.render(reason));
        res.status(reason.status || 500).json(reason);
      }
    });
  } else {
    res.status(404).end('NOT FOUND');
  }
});


const bufferSize = 100;
const messageBuffer = new Array(bufferSize);
let messageIndex = 0;

const port = process.env.NODE_ENV === 'production' ? config.port : config.apiPort;
if (config.apiPort) {
  const runnable = app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
  });

  io.on('connection', (socket) => {
    socket.emit('news', { msg: '\'Hello World!\' from server' });

    socket.on('history', () => {
      for (let index = 0; index < bufferSize; index++) {
        const msgNo = (messageIndex + index) % bufferSize;
        const msg = messageBuffer[msgNo];
        if (msg) {
          socket.emit('msg', msg);
        }
      }
    });

    socket.on('msg', (data) => {
      const message = { ...data, id: messageIndex };
      messageBuffer[messageIndex % bufferSize] = message;
      messageIndex++;
      io.emit('msg', message);
    });
  });
  io.listen(runnable);
} else {
  console.error('==>     ERROR: No APIPORT environment variable has been specified');
}
