import { createClient } from "redis";

export default class RedisStore {
  constructor(private readonly redisClient: ReturnType<typeof createClient>) {}

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.redisClient.set(key, value, { EX: ttl });
  }

  async destroy(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async touch(key: string, ttl: number): Promise<void> {
    await this.redisClient.expire(key, ttl);
  }
}
