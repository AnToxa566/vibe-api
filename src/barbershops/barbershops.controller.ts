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

import { BarbershopDTO } from './dto/barbershop.dto';
import { UpdateBarbershopDTO } from './dto/update-barbershop.dto';
import { BarbershopsService } from './barbershops.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('barbershops')
export class BarbershopsController {
  constructor(private readonly barbershopsService: BarbershopsService) {}

  @Get()
  async getBarbershops(): Promise<BarbershopDTO[]> {
    return await this.barbershopsService.getBarbershops();
  }

  @Get(':id')
  async getBarbershop(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BarbershopDTO> {
    return await this.barbershopsService.getBarbershop(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createBarbershop(
    @Body() payload: BarbershopDTO,
  ): Promise<BarbershopDTO> {
    return await this.barbershopsService.createBarbershop(payload);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updateBarbershop(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBarbershopDTO,
  ): Promise<BarbershopDTO> {
    return await this.barbershopsService.updateBarbershop(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBarbershop(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    return await this.barbershopsService.deleteBarbershop(id);
  }
}
