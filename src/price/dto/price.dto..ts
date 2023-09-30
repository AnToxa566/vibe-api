import { IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

import { Barbershop } from 'src/entities/barbershop.entity';
import { Graduation } from 'src/entities/graduation.entity';
import { Service } from 'src/entities/service.entity';

export class PriceDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNumber()
  value: number;

  @IsNotEmpty()
  service: Service;

  @IsNotEmpty()
  barbershop: Barbershop;

  @IsNotEmpty()
  graduation: Graduation;
}
