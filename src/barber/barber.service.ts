import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Barber } from 'src/entities/barber.entity';
import { BarberDTO } from 'src/dto/barber/barber.dto';
import { UpdateBarberDTO } from 'src/dto/barber/update-barber.dto';

@Injectable()
export class BarberService {
  constructor(
    @InjectRepository(Barber)
    private readonly barberRepository: Repository<Barber>,
  ) {}

  async getBarbers() {
    return await this.barberRepository.find({
      relations: { barbershop: true, graduation: true },
    });
  }

  async getBarber(id: number) {
    const barber = await this.barberRepository.findOne({
      where: { id },
      relations: { barbershop: true, graduation: true },
    });

    if (!barber) {
      throw new NotFoundException(`Барбер с ID ${id} не найден.`);
    }

    return barber;
  }

  async createBarber(
    payload: BarberDTO,
    image: Express.Multer.File,
  ): Promise<Barber> {
    return await this.barberRepository.save({
      ...payload,
      barbershop: { id: Number(payload.barbershopId) },
      graduation: { id: Number(payload.graduationId) },
      imgPath: image.filename,
    });
  }

  async updateBarber(
    id: number,
    payload: UpdateBarberDTO,
    image?: Express.Multer.File,
  ): Promise<Barber> {
    const barber = await this.barberRepository.findOne({
      where: { id },
      relations: { barbershop: true, graduation: true },
    });

    if (!barber) {
      throw new NotFoundException(`Барбер с ID ${id} не найден.`);
    }

    await this.barberRepository.update(id, {
      name: payload.name,
      barbershop: payload.barbershopId && { id: Number(payload.barbershopId) },
      graduation: payload.graduationId && { id: Number(payload.graduationId) },
      imgPath: image?.filename,
    });

    return await this.barberRepository.findOne({ where: { id } });
  }

  async deleteBarber(id: number): Promise<boolean> {
    const barber = await this.barberRepository.findOne({
      where: { id },
    });

    if (!barber) {
      throw new NotFoundException(`Барбер с ID ${id} не найден.`);
    }

    await this.barberRepository.delete(id);
    return true;
  }
}
