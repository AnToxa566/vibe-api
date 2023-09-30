import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BarberController } from './barber.controller';
import { BarberService } from './barber.service';
import { Barber } from '../entities/barber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barber])],
  controllers: [BarberController],
  providers: [BarberService],
})
export class BarberModule {}
