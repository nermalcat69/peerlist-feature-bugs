import Redis from 'ioredis';

export const databaseName =
  process.env.NODE_ENV === 'development' ? 'roadmap-dev' : 'roadmap';

// Create Redis client using REDIS_URL if available
const redis = process.env.REDIS_URL 
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });

// Test the connection
redis.on('error', (err) => console.error('Redis Client Error', err));
redis.on('connect', () => console.log('Redis Client Connected'));

export default redis;
