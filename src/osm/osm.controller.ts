import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
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
  async coordinatesToAddress(@Query() dto: CoordinatesToAddressDto) {
    return this.osmService.coordinatesToAddress(
      dto.lat.toString(),
      dto.lon.toString(),
    );
  }

}
