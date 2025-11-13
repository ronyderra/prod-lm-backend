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
        let { page = 1, limit = 10, ...filters } = query;

        page = Number(page);
        limit = Number(limit);

        if (!this.allowedLimits.includes(limit)) {
            limit = 10;
        }
        
        const cacheKey = `locations:page=${page}:limit=${limit}:filters=${JSON.stringify(
            filters,
        )}`;
        
        const cached = await this.redisService.get(cacheKey);
        if (cached) {
            return cached;
        }
       
        const skip = (page - 1) * limit;
        const data = await this.locationModel
            .find(filters)
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

        await this.redisService.set(cacheKey, result, 600); // RedisService.set() already stringifies
        return result;
    }


    async findOne(id: string) {
        return this.locationModel.findById(id).exec();
    }

    async create(createLocationDto: any): Promise<LocationDocument> {
        const createdLocation = new this.locationModel(createLocationDto);
        return createdLocation.save();
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