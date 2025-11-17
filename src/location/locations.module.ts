import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { Location, LocationSchema } from '../schemas/locations.schema';
import { RedisModule } from '../database/redis/redis.module';
import { OsmModule } from '../osm/osm.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Location.name, schema: LocationSchema }]),
    RedisModule,
    OsmModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationsModule {}
