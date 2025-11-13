import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis(process.env.REDIS_URL as string);

    this.client.on('connect', () => console.log('Redis connected'));
    this.client.on('error', (err) => console.error('Redis error:', err));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  // Example Redis helpers
  async set(key: string, value: any, ttlSeconds?: number) {
    if (ttlSeconds) {
      return this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    }
    return this.client.set(key, JSON.stringify(value));
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async del(key: string) {
    return this.client.del(key);
  }
}
