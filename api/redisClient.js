import config from 'config';
import redis from 'redis';

export const redisClient = redis.createClient(config.redisUrl);
