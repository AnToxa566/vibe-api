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

import { BarberService } from './barber.service';
import { BarberDTO } from 'src/dto/barber/barber.dto';
import { UpdateBarberDTO } from 'src/dto/barber/update-barber.dto';

@Controller('barbers')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Get()
  async getBarbers(): Promise<BarberDTO[]> {
    return await this.barberService.getBarbers();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createBarber(@Body() payload: BarberDTO): Promise<BarberDTO> {
    return await this.barberService.createBarber(payload);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updateBarber(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBarberDTO,
  ): Promise<BarberDTO> {
    return await this.barberService.updateBarber(id, payload);
  }

  @Delete(':id')
  async deleteBarber(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.barberService.deleteBarber(id);
  }
}
