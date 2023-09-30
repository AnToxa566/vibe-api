import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BarbershopsController } from './barbershops.controller';
import { BarbershopsService } from './barbershops.service';
import { Barbershop } from '../entities/barbershop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barbershop])],
  controllers: [BarbershopsController],
  providers: [BarbershopsService],
})
export class BarbershopsModule {}
