import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { GraduationService } from './graduation.service';
import { GraduationDTO } from 'src/dto/graduation/graduation.dto';

@Controller('graduations')
export class GraduationController {
  constructor(private readonly graduationService: GraduationService) {}

  @Get()
  async getGraduations(): Promise<GraduationDTO[]> {
    return await this.graduationService.getGraduations();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createGraduation(
    @Body() payload: GraduationDTO,
  ): Promise<GraduationDTO> {
    return await this.graduationService.createGraduation(payload);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateGraduation(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: GraduationDTO,
  ): Promise<GraduationDTO> {
    return await this.graduationService.updateGraduation(id, payload);
  }

  @Delete(':id')
  async deleteGraduation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return await this.graduationService.deleteGraduation(id);
  }
}
