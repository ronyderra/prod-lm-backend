import { Controller, Get, Query } from '@nestjs/common';
import { OsmService } from './osm.service';

@Controller('osm')
export class OsmController {
  constructor(private readonly osmService: OsmService) {}

  // /osm/search?query=Tel Aviv
  @Get('search')
  addressToCoordinates(@Query('query') query: string) {
    return this.osmService.addressToCoordinates(query);
  }

  // /osm/reverse?lat=32.0853&lon=34.7818
  @Get('reverse')
  coordinatesToAddress(
    @Query('lat') lat: string, 
    @Query('lon') lon: string
  ) {
    return this.osmService.coordinatesToAddress(lat, lon);
  }
}

