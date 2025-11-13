import { Controller, Get, Query, ParseFloatPipe, BadRequestException } from '@nestjs/common';
import { OsmService } from './osm.service';
import { AddressToCoordinatesDto, CoordinatesToAddressDto } from './osm.dto';

@Controller('osm')
export class OsmController {
  constructor(private readonly osmService: OsmService) { }

  @Get('search')
  addressToCoordinates(@Query() { query }: AddressToCoordinatesDto) {
    if (!query?.trim()) {
      throw new BadRequestException('Query is required');
    }
  
    return this.osmService.addressToCoordinates(query);
  }

  @Get('reverse')
  async coordinatesToAddress(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lon', ParseFloatPipe) lon: number,
  ) {
    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90');
    }

    if (lon < -180 || lon > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180');
    }

    return this.osmService.coordinatesToAddress(
      lat.toString(),
      lon.toString(),
    );
  }

}
