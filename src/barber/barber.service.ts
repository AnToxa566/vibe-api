import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Barber } from '../entities/barber.entity';
import { BarberDTO } from './dto/barber.dto';
import { UpdateBarberDTO } from './dto/update-barber.dto';

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
    return await this.ckeckBarberExist(id);
  }

  async createBarber(
    payload: BarberDTO,
    image: Express.Multer.File,
  ): Promise<Barber> {
    return await this.barberRepository.save(
      this.getBarberPayload(payload, image),
    );
  }

  async updateBarber(
    id: number,
    payload: UpdateBarberDTO,
    image?: Express.Multer.File,
  ): Promise<Barber> {
    await this.ckeckBarberExist(id);

    await this.barberRepository.update(
      id,
      this.getBarberPayload(payload, image),
    );

    return await this.getBarber(id);
  }

  async deleteBarber(id: number): Promise<boolean> {
    await this.ckeckBarberExist(id);
    await this.barberRepository.delete(id);

    return true;
  }

  async ckeckBarberExist(id: number) {
    const barber = await this.barberRepository.findOne({
      where: { id },
      relations: { barbershop: true, graduation: true },
    });

    if (!barber) {
      throw new NotFoundException(`Барбер с ID ${id} не найден.`);
    }

    return barber;
  }

  getBarberPayload(payload: UpdateBarberDTO, image: Express.Multer.File) {
    return {
      name: payload.name,
      barbershop: payload.barbershopId && { id: Number(payload.barbershopId) },
      graduation: payload.graduationId && { id: Number(payload.graduationId) },
      imgPath: image?.filename,
    };
  }
}
