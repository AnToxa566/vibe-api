import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Service } from '../entities/service.entity';
import { ServiceDTO } from './dto/service.dto';
import { UpdateServiceDTO } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async getServices(): Promise<ServiceDTO[]> {
    return await this.serviceRepository.find({
      relations: {
        prices: { barbershop: true, graduation: true },
      },
      order: { priority: 'DESC' },
    });
  }

  async getService(id: number): Promise<ServiceDTO> {
    return await this.ckeckServiceExist(id);
  }

  async createService(payload: ServiceDTO): Promise<ServiceDTO> {
    await this.ckeckServiceData(payload);
    return await this.serviceRepository.save(payload);
  }

  async updateService(
    id: number,
    payload: UpdateServiceDTO,
  ): Promise<ServiceDTO> {
    const existingServise = await this.ckeckServiceExist(id);
    await this.ckeckServiceData(payload, existingServise);
    await this.serviceRepository.update(id, payload);

    return await this.getService(id);
  }

  async deleteService(id: number): Promise<boolean> {
    await this.ckeckServiceExist(id);
    await this.serviceRepository.delete(id);

    return true;
  }

  async ckeckServiceExist(id: number) {
    const secvice = await this.serviceRepository.findOne({
      where: { id },
      relations: {
        prices: { barbershop: true, graduation: true },
      },
    });

    if (!secvice) {
      throw new NotFoundException(`Услуга с ID ${id} не найден.`);
    }

    return secvice;
  }

  async ckeckServiceData(
    payload: UpdateServiceDTO,
    existingService?: UpdateServiceDTO,
  ) {
    const secvice = await this.serviceRepository.findOne({
      where: { title: payload.title, subtitle: payload.subtitle },
    });

    if (secvice) {
      if (
        existingService &&
        existingService.title === payload.title &&
        existingService.subtitle == payload.subtitle
      ) {
        return;
      }

      throw new BadRequestException(
        `Услуга с названием ${payload.title} (${
          payload.subtitle || '-'
        }) уже существует`,
      );
    }
  }
}
