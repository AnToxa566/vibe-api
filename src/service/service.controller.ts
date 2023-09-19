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

import { ServiceService } from './service.service';
import { ServiceDTO } from 'src/dto/service/service.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async getServices(): Promise<ServiceDTO[]> {
    return await this.serviceService.getServices();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createService(@Body() payload: ServiceDTO): Promise<ServiceDTO> {
    return await this.serviceService.createService(payload);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updateService(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: ServiceDTO,
  ): Promise<ServiceDTO> {
    return await this.serviceService.updateService(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteService(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.serviceService.deleteService(id);
  }
}
