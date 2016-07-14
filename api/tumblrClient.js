import config from '../src/config';
import tumblr from 'tumblr.js';
import local from '../local';
const {
  consumer_key,
  consumer_secret,
  token,
  token_secret,
} = local;

export default tumblr.createClient({
  consumer_key,
  consumer_secret,
  token,
  token_secret,
});
