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

import { BarberService } from './barber.service';
import { BarberDTO } from 'src/dto/barber/barber.dto';
import { UpdateBarberDTO } from 'src/dto/barber/update-barber.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('barbers')
export class BarberController {
  constructor(private readonly barberService: BarberService) {}

  @Get()
  async getBarbers(): Promise<BarberDTO[]> {
    return await this.barberService.getBarbers();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createBarber(@Body() payload: BarberDTO): Promise<BarberDTO> {
    return await this.barberService.createBarber(payload);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updateBarber(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateBarberDTO,
  ): Promise<BarberDTO> {
    return await this.barberService.updateBarber(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBarber(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.barberService.deleteBarber(id);
  }
}
