import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../schemas/locations.schema';

@Injectable()
export class LocationService {
    private readonly allowedLimits = [5, 10, 25];
    constructor(
        @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    ) { }

    async findAll(query: any = {}) {
        let { page = 1, limit = 10, ...filters } = query;

        page = Number(page);
        limit = Number(limit);

        // Enforce allowed limits
        if (!this.allowedLimits.includes(limit)) {
            limit = 10; // default safe fallback
        }

        const skip = (page - 1) * limit;

        const data = await this.locationModel
            .find(filters)
            .skip(skip)
            .limit(limit)
            .exec();

        const total = await this.locationModel.countDocuments(filters);

        return {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data,
        };
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