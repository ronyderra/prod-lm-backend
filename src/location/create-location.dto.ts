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

export class CoordinatesDto {
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
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
