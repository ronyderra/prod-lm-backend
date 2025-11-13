import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { OsmService } from './osm.service';
import { AddressToCoordinatesDto, CoordinatesToAddressDto } from './osm.dto';

@ApiTags('osm')
@Controller('osm')
export class OsmController {
  constructor(private readonly osmService: OsmService) { }

  @Get('search')
  @ApiOperation({ summary: 'Convert an address to coordinates using OpenStreetMap' })
  @ApiQuery({ name: 'query', type: String, description: 'Address or location name', example: 'Tel Aviv' })
  @ApiResponse({ status: 200, description: 'Returns coordinates for the address' })
  @ApiResponse({ status: 400, description: 'Query parameter is required' })
  @ApiResponse({ status: 500, description: 'Failed to get coordinates from Nominatim' })
  addressToCoordinates(@Query() { query }: AddressToCoordinatesDto) {
    if (!query?.trim()) {
      throw new BadRequestException('Query is required');
    }
  
    return this.osmService.addressToCoordinates(query);
  }

  @Get('reverse')
  @ApiOperation({ summary: 'Convert coordinates to an address using OpenStreetMap' })
  @ApiQuery({ name: 'lat', type: Number, description: 'Latitude (-90 to 90)', example: 32.0853 })
  @ApiQuery({ name: 'lon', type: Number, description: 'Longitude (-180 to 180)', example: 34.7818 })
  @ApiResponse({ status: 200, description: 'Returns address for the coordinates' })
  @ApiResponse({ status: 400, description: 'Invalid coordinates' })
  @ApiResponse({ status: 500, description: 'Failed to reverse geocode coordinates' })
  async coordinatesToAddress(@Query() dto: CoordinatesToAddressDto) {
    return this.osmService.coordinatesToAddress(
      dto.lat.toString(),
      dto.lon.toString(),
    );
  }

}
