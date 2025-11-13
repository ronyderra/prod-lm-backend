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
    try {
      const cacheKey = `osm:addressToCoordinates:${query.toLowerCase().trim()}`;
      let cached: any = null;
      try {
        cached = await this.redisService.get(cacheKey);
      } catch (redisErr) {
        console.error('Redis GET error:', redisErr);
      }

      if (cached) {
        return cached;
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
    } catch (err) {
      console.error('Error fetching coordinates:', err);
      throw new Error('Failed to get coordinates from Nominatim');
    }
  }

  async coordinatesToAddress(lat: string | number, lon: string | number) {
    try {
      const cacheKey = `osm:coordinatesToAddress:${lat}:${lon}`;
      let cached: any = null;
      try {
        cached = await this.redisService.get(cacheKey);
      } catch (redisErr) {
        console.error('Redis GET error:', redisErr);
      }

      if (cached) {
        return cached;
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
    } catch (err) {
      console.error('Error reverse geocoding:', err);
      throw new Error('Failed to reverse geocode coordinates');
    }
  }
}
