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

import { PriceService } from './price.service';
import { PriceDTO } from 'src/dto/price/price.dto.';
import { UpdatePriceDTO } from 'src/dto/price/update-price.dto';

@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get()
  async getPrices(): Promise<PriceDTO[]> {
    return await this.priceService.getPrices();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createPrice(@Body() payload: PriceDTO): Promise<PriceDTO> {
    return await this.priceService.createPrice(payload);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async updatePrice(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdatePriceDTO,
  ): Promise<PriceDTO> {
    return await this.priceService.updatePrice(id, payload);
  }

  @Delete(':id')
  async deletePrice(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.priceService.deletePrice(id);
  }
}
