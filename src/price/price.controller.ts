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

import { PriceService } from './price.service';
import { PriceDTO } from './dto/price.dto.';
import { UpdatePriceDTO } from './dto/update-price.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  async getPrices(): Promise<PriceDTO[]> {
    return await this.priceService.getPrices();
  }

  @Get(':id')
  async getPrice(@Param('id', ParseIntPipe) id: number): Promise<PriceDTO> {
    return await this.priceService.getPrice(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async createPrice(@Body() payload: PriceDTO): Promise<PriceDTO> {
    return await this.priceService.createPrice(payload);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async updatePrice(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePriceDTO,
  ): Promise<PriceDTO> {
    return await this.priceService.updatePrice(id, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePrice(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.priceService.deletePrice(id);
  }
}
