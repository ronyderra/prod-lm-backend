import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../schemas/locations.schema';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  async findAll(query?: any) {
    return this.locationModel.find(query).exec();
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