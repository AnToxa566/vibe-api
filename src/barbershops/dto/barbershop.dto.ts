import {
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class BarbershopDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsArray()
  phoneNumbers: string[];

  @IsString()
  @IsNotEmpty()
  schedule: string;
}
