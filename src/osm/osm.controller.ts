import { Controller, Get, Query } from '@nestjs/common';
import { OsmService } from './osm.service';

@Controller('osm')
export class OsmController {
  constructor(private readonly osmService: OsmService) {}

  @Get('search')
  addressToCoordinates(@Query('query') query: string) {
    return this.osmService.addressToCoordinates(query);
  }

  @Get('reverse')
  coordinatesToAddress(
    @Query('lat') lat: string, 
    @Query('lon') lon: string
  ) {
    return this.osmService.coordinatesToAddress(lat, lon);
  }
}

