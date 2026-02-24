import { createClient } from "redis";

export default class RedisStore {
  constructor(private readonly redisClient: ReturnType<typeof createClient>) {}

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl: number): Promise<string | null> {
    return await this.redisClient.set(key, value, {
      expiration: { type: "PX", value: ttl },
    });
  }

  async destroy(key: string): Promise<number> {
    return await this.redisClient.del(key);
  }

  async touch(key: string, ttl: number): Promise<number> {
    return await this.redisClient.expire(key, ttl);
  }
}
