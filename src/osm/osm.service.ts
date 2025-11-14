import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RedisService } from '../database/redis/redis.service';

@Injectable()
export class OsmService {
  private readonly BASE_URL: string;
  private readonly CACHE_TTL = 600;

  constructor(
    private configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.BASE_URL =
      this.configService.get<string>('GEO_BASE_URL') || 'https://nominatim.openstreetmap.org';
  }

  async addressToCoordinates(query: string) {
    const cacheKey = `osm:addressToCoordinates:${query.toLowerCase().trim()}`;
    try {
      const cached = await this.redisService.get(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('Redis GET error:', err);
    }

    const url = `${this.BASE_URL}/search`;
    const response = await axios.get(url, {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 1,
      },
      headers: {
        'User-Agent': 'LocationManagementApp/1.0',
      },
    });

    const result = response.data.length ? response.data[0] : null;
    if (result) {
      this.redisService
        .set(cacheKey, result, this.CACHE_TTL)
        .then(() => console.log(`Redis cache saved → ${cacheKey}`))
        .catch((err) => console.error('Redis SET error:', err));
    }

    return result;
  }

  async coordinatesToAddress(lat: string | number, lon: string | number) {
    const cacheKey = `osm:coordinatesToAddress:${lat}:${lon}`;
    try {
      const cached = await this.redisService.get(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('Redis GET error:', err);
    }

    const url = `${this.BASE_URL}/reverse`;
    const response = await axios.get(url, {
      params: {
        lat,
        lon,
        format: 'json',
        addressdetails: 1,
      },
      headers: {
        'User-Agent': 'LocationManagementApp/1.0',
      },
    });

    const result = response.data;

    if (result) {
      this.redisService
        .set(cacheKey, result, this.CACHE_TTL)
        .then(() => console.log(`Redis cache saved → ${cacheKey}`))
        .catch((err) => console.error('Redis SET error:', err));
    }

    return result;
  }
}
