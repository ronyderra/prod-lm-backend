import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.locationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(id);
  }

  @Post()
  create(@Body() createLocationDto: any) {
    return this.locationService.create(createLocationDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: any) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }
}