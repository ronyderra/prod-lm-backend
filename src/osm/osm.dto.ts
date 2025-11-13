import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class AddressToCoordinatesDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}

export class CoordinatesToAddressDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lon: number;
}

