import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CreateLocationDto, FindLocationsQueryDto, UpdateLocationDto } from './location.dto';
import { ApiFindAllLocations, ApiCreateLocation, ApiUpdateLocation, ApiDeleteLocation } from '../common/decorators/swagger.decorators';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ApiFindAllLocations()
  findAll(@Query() query: FindLocationsQueryDto) {
    return this.locationService.findAll(query);
  }

  @Post()
  @ApiCreateLocation()
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Put(':id')
  @ApiUpdateLocation()
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @ApiDeleteLocation()
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }
}
