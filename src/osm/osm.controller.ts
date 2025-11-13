import { Controller, Get, Query, ParseFloatPipe, BadRequestException } from '@nestjs/common';
import { OsmService } from './osm.service';
import { AddressToCoordinatesDto, CoordinatesToAddressDto } from './osm.dto';

@Controller('osm')
export class OsmController {
  constructor(private readonly osmService: OsmService) {}

  @Get('search')
  addressToCoordinates(@Query() queryDto: AddressToCoordinatesDto) {
    if (!queryDto.query || queryDto.query.trim().length === 0) {
      throw new BadRequestException('Query parameter is required and cannot be empty');
    }
    return this.osmService.addressToCoordinates(queryDto.query);
  }

  @Get('reverse')
  async coordinatesToAddress(
    @Query('lat', new ParseFloatPipe({ exceptionFactory: () => new BadRequestException('Latitude must be a valid number') })) lat: number,
    @Query('lon', new ParseFloatPipe({ exceptionFactory: () => new BadRequestException('Longitude must be a valid number') })) lon: number,
  ) {
    // Validate ranges
    if (lat < -90 || lat > 90) {
      throw new BadRequestException('Latitude must be between -90 and 90');
    }
    if (lon < -180 || lon > 180) {
      throw new BadRequestException('Longitude must be between -180 and 180');
    }
    return this.osmService.coordinatesToAddress(lat.toString(), lon.toString());
  }
}
