import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AddressToCoordinatesDto {
  @ApiProperty({
    description: 'Address or location name to search for',
    example: 'Tel Aviv',
  })
  @IsString()
  @IsNotEmpty()
  query: string;
}

export class CoordinatesToAddressDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: 32.0853,
    minimum: -90,
    maximum: 90,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: 34.7818,
    minimum: -180,
    maximum: 180,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;
}

