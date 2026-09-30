import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Barber } from '../entities/barber.entity';
import { BarberDTO } from './dto/barber.dto';
import { UpdateBarberDTO } from './dto/update-barber.dto';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class BarberService {
  constructor(
    @InjectRepository(Barber)
    private readonly barberRepository: Repository<Barber>,
    private readonly storageService: StorageService,
  ) {}

  async getBarbers() {
    return await this.barberRepository.find({
      relations: { barbershop: true, graduation: true },
      order: { graduation: { priority: 'DESC' } },
    });
  }

  async getBarber(id: number) {
    return await this.ckeckBarberExist(id);
  }

  async createBarber(
    payload: BarberDTO,
    image: Express.Multer.File,
  ): Promise<Barber> {
    if (!image) {
      throw new BadRequestException('Необходимо загрузить изображение.');
    }

    const imgKey = await this.storageService.upload(image);
    let barber: Barber;

    try {
      barber = await this.barberRepository.save(
        this.getBarberPayload(payload, imgKey),
      );
    } catch (error) {
      await this.storageService.delete(imgKey);
      throw error;
    }

    return await this.getBarber(barber.id);
  }

  async updateBarber(
    id: number,
    payload: UpdateBarberDTO,
    image?: Express.Multer.File,
  ): Promise<Barber> {
    const barber = await this.ckeckBarberExist(id);
    const imgKey = await this.storageService.upload(image);

    try {
      await this.barberRepository.update(
        id,
        this.getBarberPayload(payload, imgKey),
      );
    } catch (error) {
      await this.storageService.delete(imgKey);
      throw error;
    }

    if (imgKey) {
      await this.storageService.delete(barber.imgPath);
    }

    return await this.getBarber(id);
  }

  async deleteBarber(id: number): Promise<boolean> {
    const barber = await this.ckeckBarberExist(id);
    await this.barberRepository.delete(id);
    await this.storageService.delete(barber.imgPath);

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

  getBarberPayload(payload: UpdateBarberDTO, imgKey?: string) {
    return {
      name: payload.name,
      altegioId: Number(payload.altegioId),
      barbershop: payload.barbershopId && { id: Number(payload.barbershopId) },
      graduation: payload.graduationId && { id: Number(payload.graduationId) },
      imgPath: imgKey,
    };
  }
}
