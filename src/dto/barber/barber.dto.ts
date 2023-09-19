import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { Barbershop } from 'src/entities/barbershop.entity';
import { Graduation } from 'src/entities/graduation.entity';

export class BarberDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  img_path: string;

  @IsNotEmpty()
  barbershop: Barbershop;

  @IsNotEmpty()
  graduation: Graduation;
}
