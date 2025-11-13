import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { CreateLocationDto } from './create-location.dto';

@ApiTags('locations')
@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @ApiOperation({ summary: 'Get all locations with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (allowed: 5, 10, 25)', example: 10 })
  @ApiQuery({ name: 'category', required: false, enum: ['office', 'store', 'landmark'], description: 'Filter by category' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by name' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of locations' })
  findAll(@Query() query: any) {
    return this.locationService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new location' })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({ status: 201, description: 'Location created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a location by ID' })
  @ApiParam({ name: 'id', description: 'Location ID', example: '507f1f77bcf86cd799439011' })
  @ApiBody({ type: CreateLocationDto })
  @ApiResponse({ status: 200, description: 'Location updated successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  update(@Param('id') id: string, @Body() updateLocationDto: any) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a location by ID' })
  @ApiParam({ name: 'id', description: 'Location ID', example: '507f1f77bcf86cd799439011' })
  @ApiResponse({ status: 200, description: 'Location deleted successfully' })
  @ApiResponse({ status: 404, description: 'Location not found' })
  remove(@Param('id') id: string) {
    return this.locationService.remove(id);
  }
}
