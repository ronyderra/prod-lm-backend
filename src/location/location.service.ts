import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../schemas/locations.schema';
import { RedisService } from '../database/redis/redis.service';
import { FindLocationsQueryDto, CreateLocationDto, UpdateLocationDto } from './location.dto';
import { EventsService } from '../events/events.service';
import { OsmService } from '../osm/osm.service';

@Injectable()
export class LocationService {
  private readonly limit = 10;
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    private readonly redisService: RedisService,
    private readonly osmService: OsmService,
    private readonly events: EventsService,
  ) { }

  async findAll(query: FindLocationsQueryDto = {}) {
    const { page = 1, ...filters } = query;
    const cacheKey = `locations:page=${page}:limit=${this.limit}:filters=${JSON.stringify(filters)}`;

    try {
      const cached = await this.redisService.get(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('Redis failed on GET operation:', err);
    }

    const skip = (page - 1) * this.limit;
    const data = await this.locationModel
      .find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(this.limit)
      .exec();

    const total = await this.locationModel.countDocuments(filters);
    const result = {
      page,
      limit: this.limit,
      total,
      totalPages: Math.ceil(total / this.limit),
      data,
    };

    this.redisService
      .set(cacheKey, JSON.stringify(result), 600)
      .then(() => console.log(`saved: ${cacheKey}`))
      .catch((err) => console.error('Redis SET error:', err));

    return result;
  }

  async create(createLocationDto: CreateLocationDto) {
    if (!createLocationDto.address || createLocationDto.address.trim() === '') {
      const osmResult = await this.osmService.coordinatesToAddress(
        createLocationDto.coordinates.lat,
        createLocationDto.coordinates.lon,
      );
      if (osmResult?.address) {
        const address = osmResult.address;
        createLocationDto.address = [address.city, address.country || osmResult.display_name]
          .filter(Boolean)
          .join(', ');
      }
    }
    const createdLocation = new this.locationModel(createLocationDto);
    const saved = await createdLocation.save();
   
    await this.redisService
      .deleteByPattern('locations:*')
      .then(() => console.log('Redis cache cleared (create)'))
      .catch((err) => console.error('Redis clear error:', err));

    this.events.broadcast({ type: 'refetch_locations' });
    return saved;
  }

  async update(id: string, updateLocationDto: UpdateLocationDto) {
    const updated = await this.locationModel
      .findByIdAndUpdate(id, updateLocationDto, { new: true })
      .exec();

    await this.redisService
      .deleteByPattern('locations:*')
      .then(() => console.log('Redis cache cleared (update)'))
      .catch((err) => console.error('Redis clear error:', err));

    this.events.broadcast({ type: 'refetch_locations' });
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.locationModel.findByIdAndDelete(id).exec();

    await this.redisService
      .deleteByPattern('locations:*')
      .then(() => console.log('Redis cache cleared (delete)'))
      .catch((err) => console.error('Redis clear error:', err));

    this.events.broadcast({ type: 'refetch_locations' });
    return deleted;
  }
}
