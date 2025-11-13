import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../schemas/locations.schema';
import { RedisService } from '../database/redis/redis.service';
@Injectable()
export class LocationService {
    private readonly allowedLimits = [5, 10, 25];
    constructor(
        @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
        private readonly redisService: RedisService,
    ) { }

    async findAll(query: any = {}) {
        try {
            let { page = 1, limit = 10, ...filters } = query;

            page = Number(page);
            limit = Number(limit);

            if (!this.allowedLimits.includes(limit)) {
                limit = 10;
            }

            const cacheKey = `locations:page=${page}:limit=${limit}:filters=${JSON.stringify(
                filters,
            )}`;

            let cached: any = null;
            try {
                cached = await this.redisService.get(cacheKey);
            } catch (redisErr) {
                console.error('Redis GET error:', redisErr);
            }

            if (cached) {
                return cached;
            }

            const skip = (page - 1) * limit;
            const data = await this.locationModel
                .find(filters)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const total = await this.locationModel.countDocuments(filters);
            const result = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                data,
            };

            this.redisService
                .set(cacheKey, result, 600)
                .then(() => console.log(`Redis cache saved → ${cacheKey}`))
                .catch(err => console.error('Redis SET error:', err));

            return result;

        } catch (err) {
            console.error('Database error in findAll:', err);
            throw new Error('Failed to fetch locations');
        }
    }

    async findOne(id: string) {
        return this.locationModel.findById(id).exec();
    }

    async create(createLocationDto: any): Promise<LocationDocument> {
        try {
            const createdLocation = new this.locationModel(createLocationDto);
            const saved = await createdLocation.save();
            this.redisService
                .deleteByPattern('locations:*')
                .then(() => console.log('Redis cache cleared (create)'))
                .catch(err => console.error('Redis clear error:', err));
            return saved;
        } catch (err) {
            console.error('Error creating location:', err);
            throw new Error('Failed to create location');
        }
    }

    async update(id: string, updateLocationDto: any) {
        return this.locationModel
            .findByIdAndUpdate(id, updateLocationDto, { new: true })
            .exec();
    }

    async remove(id: string) {
        return this.locationModel.findByIdAndDelete(id).exec();
    }
}