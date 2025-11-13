import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressToCoordinatesDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}

export class CoordinatesToAddressDto {
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;
}

