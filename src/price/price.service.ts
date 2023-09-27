import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Price } from 'src/entities/price.entity';
import { PriceDTO } from 'src/dto/price/price.dto.';
import { UpdatePriceDTO } from 'src/dto/price/update-price.dto';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
    private readonly priceRepository: Repository<Price>,
  ) {}

  async getPrices(): Promise<PriceDTO[]> {
    return await this.priceRepository.find({
      relations: { service: true, barbershop: true, graduation: true },
    });
  }

  async getPrice(id: number): Promise<PriceDTO> {
    const price = await this.priceRepository.findOne({
      where: { id },
      relations: { service: true, barbershop: true, graduation: true },
    });

    if (!price) {
      throw new NotFoundException(`Цена с ID ${id} не найден.`);
    }

    return price;
  }

  async createPrice(payload: PriceDTO): Promise<PriceDTO> {
    const price = await this.priceRepository.findOne({
      where: {
        barbershop: { id: payload.barbershop.id },
        graduation: { id: payload.graduation.id },
        service: { id: payload.service.id },
      },
    });

    if (price) {
      throw new BadRequestException(
        'Цена с заданными параметрами уже существует',
      );
    }

    return await this.priceRepository.save(payload);
  }

  async updatePrice(id: number, payload: UpdatePriceDTO): Promise<PriceDTO> {
    const price = await this.priceRepository.findOne({
      where: { id },
    });

    if (!price) {
      throw new NotFoundException(`Цена с ID ${id} не найден.`);
    }

    await this.priceRepository.update(id, payload);

    return await this.priceRepository.findOne({ where: { id } });
  }

  async deletePrice(id: number): Promise<boolean> {
    const price = await this.priceRepository.findOne({
      where: { id },
    });

    if (!price) {
      throw new NotFoundException(`Цена с ID ${id} не найден.`);
    }

    await this.priceRepository.delete(id);
    return true;
  }
}
