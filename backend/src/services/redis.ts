import { Redis } from "@upstash/redis";

export const createRedisClient = (env: { UPSTASH_REDIS_URL: string; UPSTASH_REDIS_TOKEN: string }) => {
  return new Redis({
    url: env.UPSTASH_REDIS_URL,
    token: env.UPSTASH_REDIS_TOKEN,
  });
};
