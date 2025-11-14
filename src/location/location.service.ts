import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../schemas/locations.schema';
import { RedisService } from '../database/redis/redis.service';
import { FindLocationsQueryDto, CreateLocationDto, UpdateLocationDto } from './location.dto';
@Injectable()
export class LocationService {
  private readonly allowedLimits = [5, 10, 25];
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    private readonly redisService: RedisService,
  ) { }

  async findAll(query: FindLocationsQueryDto = {}) {
    const { page = 1, limit = 10, ...filters } = query;
    const validLimit = this.allowedLimits.includes(limit) ? limit : 10;
    const cacheKey = `locations:page=${page}:limit=${validLimit}:filters=${JSON.stringify(filters)}`;

    try {
      const cached = await this.redisService.get(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('Redis GET error:', err);
    }

    const skip = (page - 1) * validLimit;
    const data = await this.locationModel
      .find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(validLimit)
      .exec();

    const total = await this.locationModel.countDocuments(filters);
    const result = {
      page,
      limit: validLimit,
      total,
      totalPages: Math.ceil(total / validLimit),
      data,
    };


    this.redisService
      .set(cacheKey, result, 600)
      .then(() => console.log(`saved: ${cacheKey}`))
      .catch((err) => console.error('Redis SET error:', err));

    return result;
  }

  async create(createLocationDto: CreateLocationDto) {
    const createdLocation = new this.locationModel(createLocationDto);
    const saved = await createdLocation.save();

    this.redisService
      .deleteByPattern('locations:*')
      .then(() => console.log('Redis cache cleared (create)'))
      .catch((err) => console.error('Redis clear error:', err));

    return saved;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const updated = await this.locationModel
      .findByIdAndUpdate(id, updateLocationDto, { new: true })
      .exec();

    this.redisService
      .deleteByPattern('locations:*')
      .then(() => console.log('Redis cache cleared (update)'))
      .catch((err) => console.error('Redis clear error:', err));

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.locationModel.findByIdAndDelete(id).exec();

    this.redisService
      .deleteByPattern('locations:*')
      .then(() => console.log('Redis cache cleared (delete)'))
      .catch((err) => console.error('Redis clear error:', err));

    return deleted;
  }
}
