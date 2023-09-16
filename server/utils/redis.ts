import { Redis } from 'ioredis';
require('dotenv').config();

const redisClient = () => {
	if (process.env.REDIS_URL) {
		console.log(`Connecting to Redis at ${process.env.REDIS_URL}`);
		return process.env.REDIS_URL;
	}
	throw new Error('REDIS_URL not found');
};

export const redis = new Redis(redisClient());
