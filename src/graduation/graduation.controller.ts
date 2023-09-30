import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { GraduationService } from './graduation.service';
import { GraduationDTO } from './dto/graduation.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('graduations')
export class GraduationController {
  constructor(private readonly graduationService: GraduationService) {}

  @Get()
  async getGraduations(): Promise<GraduationDTO[]> {
    return await this.graduationService.getGraduations();
  }

  @Get(':id')
  async getGraduation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GraduationDTO> {
    return await this.graduationService.getGraduation(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createGraduation(
    @Body() payload: GraduationDTO,
  ): Promise<GraduationDTO> {
    return await this.graduationService.createGraduation(payload);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updateGraduation(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: GraduationDTO,
  ): Promise<GraduationDTO> {
    return await this.graduationService.updateGraduation(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteGraduation(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return await this.graduationService.deleteGraduation(id);
  }
}
