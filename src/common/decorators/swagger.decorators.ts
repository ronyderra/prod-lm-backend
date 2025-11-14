import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateLocationDto, UpdateLocationDto } from '../../location/location.dto';

// Location endpoints decorators
export const ApiFindAllLocations = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all locations with pagination and filtering' }),
    ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)', example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (allowed: 5, 10, 25)', example: 10 }),
    ApiQuery({ name: 'category', required: false, enum: ['office', 'store', 'landmark'], description: 'Filter by category' }),
    ApiQuery({ name: 'name', required: false, type: String, description: 'Filter by name' }),
    ApiResponse({ status: 200, description: 'Returns paginated list of locations' }),
  );

export const ApiCreateLocation = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new location' }),
    ApiBody({ type: CreateLocationDto }),
    ApiResponse({ status: 201, description: 'Location created successfully' }),
    ApiResponse({ status: 400, description: 'Validation error' }),
  );

export const ApiUpdateLocation = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update a location by ID' }),
    ApiParam({ name: 'id', description: 'Location ID', example: '507f1f77bcf86cd799439011' }),
    ApiBody({ type: UpdateLocationDto }),
    ApiResponse({ status: 200, description: 'Location updated successfully' }),
    ApiResponse({ status: 404, description: 'Location not found' }),
    ApiResponse({ status: 400, description: 'Validation error' }),
  );

export const ApiDeleteLocation = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a location by ID' }),
    ApiParam({ name: 'id', description: 'Location ID', example: '507f1f77bcf86cd799439011' }),
    ApiResponse({ status: 200, description: 'Location deleted successfully' }),
    ApiResponse({ status: 404, description: 'Location not found' }),
  );

// OSM endpoints decorators
export const ApiAddressToCoordinates = () =>
  applyDecorators(
    ApiOperation({ summary: 'Convert an address to coordinates using OpenStreetMap' }),
    ApiQuery({ name: 'query', type: String, description: 'Address or location name', example: 'Tel Aviv' }),
    ApiResponse({ status: 200, description: 'Returns coordinates for the address' }),
    ApiResponse({ status: 400, description: 'Query parameter is required' }),
    ApiResponse({ status: 500, description: 'Failed to get coordinates from Nominatim' }),
  );

export const ApiCoordinatesToAddress = () =>
  applyDecorators(
    ApiOperation({ summary: 'Convert coordinates to an address using OpenStreetMap' }),
    ApiQuery({ name: 'lat', type: Number, description: 'Latitude (-90 to 90)', example: 32.0853 }),
    ApiQuery({ name: 'lon', type: Number, description: 'Longitude (-180 to 180)', example: 34.7818 }),
    ApiResponse({ status: 200, description: 'Returns address for the coordinates' }),
    ApiResponse({ status: 400, description: 'Invalid coordinates' }),
    ApiResponse({ status: 500, description: 'Failed to reverse geocode coordinates' }),
  );

