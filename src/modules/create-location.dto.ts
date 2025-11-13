import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsEnum,
    ValidateNested,
    IsNumber,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CoordinatesDto {
    @IsNumber()
    lon: number;
  
    @IsNumber()
    lat: number;
  }
  
  export class CreateLocationDto {
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsEnum(['office', 'store', 'landmark'])
    category: 'office' | 'store' | 'landmark';
  
    @ValidateNested()
    @Type(() => CoordinatesDto)
    coordinates: CoordinatesDto;
  
    @IsOptional()
    @IsString()
    address?: string;
  
    @IsOptional()
    @IsString()
    notes?: string;
  }
  