import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  ValidateNested,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CoordinatesDto {
  @ApiProperty({
    description: 'Longitude coordinate',
    example: -122.4194,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;

  @ApiProperty({
    description: 'Latitude coordinate',
    example: 37.7749,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;
}

export class CreateLocationDto {
  @ApiProperty({
    description: 'Location name',
    example: 'Downtown Office',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Location category',
    enum: ['office', 'store', 'landmark'],
    example: 'office',
  })
  @IsEnum(['office', 'store', 'landmark'])
  category: 'office' | 'store' | 'landmark';

  @ApiProperty({
    description: 'Location coordinates',
    type: CoordinatesDto,
  })
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates: CoordinatesDto;

  @ApiPropertyOptional({
    description: 'Location address',
    example: '123 Main Street, New York, NY 10001',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the location',
    example: 'Main retail location with parking available',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateLocationDto {
  @ApiPropertyOptional({
    description: 'Location name',
    example: 'Downtown Office',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'Location category',
    enum: ['office', 'store', 'landmark'],
    example: 'office',
  })
  @IsOptional()
  @IsEnum(['office', 'store', 'landmark'])
  category?: 'office' | 'store' | 'landmark';

  @ApiPropertyOptional({
    description: 'Location coordinates',
    type: CoordinatesDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  coordinates?: CoordinatesDto;

  @ApiPropertyOptional({
    description: 'Location address',
    example: '123 Main Street, New York, NY 10001',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about the location',
    example: 'Main retail location with parking available',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class FindLocationsQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Filter by category',
    enum: ['office', 'store', 'landmark'],
    example: 'office',
  })
  @IsOptional()
  @IsEnum(['office', 'store', 'landmark'])
  category?: 'office' | 'store' | 'landmark';
}

