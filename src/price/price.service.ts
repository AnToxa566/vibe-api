import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Price } from '../entities/price.entity';
import { PriceDTO } from './dto/price.dto.';
import { UpdatePriceDTO } from './dto/update-price.dto';

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
    return await this.ckeckPriceExist(id);
  }

  async createPrice(payload: PriceDTO): Promise<PriceDTO> {
    await this.ckeckPriceData(payload);
    return await this.priceRepository.save(payload);
  }

  async updatePrice(id: number, payload: UpdatePriceDTO): Promise<PriceDTO> {
    await this.ckeckPriceExist(id);
    await this.ckeckPriceData(payload, id);
    await this.priceRepository.update(id, payload);

    return await this.getPrice(id);
  }

  async deletePrice(id: number): Promise<boolean> {
    await this.ckeckPriceExist(id);
    await this.priceRepository.delete(id);

    return true;
  }

  async ckeckPriceExist(id: number) {
    const price = await this.priceRepository.findOne({
      where: { id },
      relations: { service: true, barbershop: true, graduation: true },
    });

    if (!price) {
      throw new NotFoundException(`Цена с ID ${id} не найден.`);
    }

    return price;
  }

  async ckeckPriceData(payload: UpdatePriceDTO, id?: number) {
    const price = await this.priceRepository.findOne({
      where: {
        barbershop: { id: payload.barbershop.id },
        graduation: { id: payload.graduation.id },
        service: { id: payload.service.id },
      },
    });

    if (price) {
      if (id && price.id === id) {
        return;
      }

      throw new BadRequestException(
        'Цена с заданными параметрами уже существует',
      );
    }
  }
}
