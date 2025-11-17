import { Module } from '@nestjs/common';
import { OsmService } from './osm.service';
import { OsmController } from './osm.controller';
import { RedisModule } from '../database/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [OsmController],
  providers: [OsmService],
  exports: [OsmService],
})
export class OsmModule {}
