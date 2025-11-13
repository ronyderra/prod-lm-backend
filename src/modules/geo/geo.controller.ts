import { Controller, Get, Query } from '@nestjs/common';
import { GeoService } from './geo.service';

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  // /geo/search?query=Tel Aviv
  @Get('search')
  addressToCoordinates(@Query('query') query: string) {
    return this.geoService.addressToCoordinates(query);
  }

  // /geo/reverse?lat=32.0853&lon=34.7818
  @Get('reverse')
  coordinatesToAddress(
    @Query('lat') lat: string, 
    @Query('lon') lon: string
  ) {
    return this.geoService.coordinatesToAddress(lat, lon);
  }
}