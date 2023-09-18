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

import { BarbershopDTO } from 'src/dto/barbershop/barbershop.dto';
import { UpdateBarbershopDTO } from 'src/dto/barbershop/update-barbershop.dto';
import { BarbershopsService } from './barbershops.service';

@Controller('barbershops')
export class BarbershopsController {
  constructor(private readonly barbershopsService: BarbershopsService) {}

  @Get()
  async getBarbershops(): Promise<BarbershopDTO[]> {
    return await this.barbershopsService.getBarbershops();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createBarbershop(
    @Body() payload: BarbershopDTO,
  ): Promise<BarbershopDTO> {
    return await this.barbershopsService.createBarbershop(payload);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateBarbershop(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBarbershopDTO,
  ): Promise<BarbershopDTO> {
    return await this.barbershopsService.updateBarbershop(id, payload);
  }

  @Delete(':id')
  async deleteBarbershop(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return await this.barbershopsService.deleteBarbershop(id);
  }
}
