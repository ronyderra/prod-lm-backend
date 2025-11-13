import { Module } from '@nestjs/common';
import { OsmService } from './osm.service';
import { OsmController } from './osm.controller';

@Module({
  controllers: [OsmController],
  providers: [OsmService],
})
export class OsmModule {}
