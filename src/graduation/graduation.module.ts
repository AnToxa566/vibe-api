import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GraduationController } from './graduation.controller';
import { GraduationService } from './graduation.service';
import { Graduation } from '../entities/graduation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Graduation])],
  controllers: [GraduationController],
  providers: [GraduationService],
})
export class GraduationModule {}
