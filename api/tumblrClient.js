// import config from '../src/config';
import tumblr from 'tumblr.js';
import config from 'config';
const {
  consumer_key,
  consumer_secret,
  token,
  token_secret,
} = config;

export default tumblr.createClient({
  consumer_key,
  consumer_secret,
  token,
  token_secret,
});
