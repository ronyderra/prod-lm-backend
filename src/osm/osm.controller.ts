import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OsmService } from './osm.service';
import { AddressToCoordinatesDto, CoordinatesToAddressDto } from './osm.dto';
import { ApiAddressToCoordinates, ApiCoordinatesToAddress } from '../common/decorators/swagger.decorators';

@ApiTags('osm')
@Controller('osm')
export class OsmController {
  constructor(private readonly osmService: OsmService) { }

  @Get('search')
  @ApiAddressToCoordinates()
  addressToCoordinates(@Query() { query }: AddressToCoordinatesDto) {
    if (!query?.trim()) {
      throw new BadRequestException('Query is required');
    }
  
    return this.osmService.addressToCoordinates(query);
  }

  @Get('reverse')
  @ApiCoordinatesToAddress()
  async coordinatesToAddress(@Query() dto: CoordinatesToAddressDto) {
    return this.osmService.coordinatesToAddress(
      dto.lat.toString(),
      dto.lon.toString(),
    );
  }

}
