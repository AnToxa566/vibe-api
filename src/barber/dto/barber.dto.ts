import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class BarberDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  barbershopId: string;

  @IsString()
  @IsNotEmpty()
  graduationId: string;
}
