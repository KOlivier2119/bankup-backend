import { Redis } from 'ioredis';
import "dotenv/config";

const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);

export const redis = new Redis({
  host: redisHost,
  port: redisPort,
  password: process.env.REDIS_PASSWORD,
  lazyConnect: true,
});