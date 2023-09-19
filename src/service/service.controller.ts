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

import { ServiceService } from './service.service';
import { ServiceDTO } from 'src/dto/service/service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Get()
  async getServices(): Promise<ServiceDTO[]> {
    return await this.serviceService.getServices();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createService(@Body() payload: ServiceDTO): Promise<ServiceDTO> {
    return await this.serviceService.createService(payload);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateService(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: ServiceDTO,
  ): Promise<ServiceDTO> {
    return await this.serviceService.updateService(id, payload);
  }

  @Delete(':id')
  async deleteService(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.serviceService.deleteService(id);
  }
}
