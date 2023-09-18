import { IsNumber, IsString, IsArray, IsOptional } from 'class-validator';

export class BarbershopDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  address: string;

  @IsArray()
  phone_numbers: string[];

  @IsString()
  schedule: string;
}
