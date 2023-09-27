import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Service } from 'src/entities/service.entity';
import { ServiceDTO } from 'src/dto/service/service.dto';

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
    });
  }

  async getService(id: number): Promise<ServiceDTO> {
    const secvice = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!secvice) {
      throw new NotFoundException(`Услуга с ID ${id} не найден.`);
    }

    return secvice;
  }

  async createService(payload: ServiceDTO): Promise<ServiceDTO> {
    const secvice = await this.serviceRepository.findOne({
      where: { title: payload.title, subtitle: payload.subtitle },
    });

    if (secvice) {
      throw new BadRequestException(
        `Услуга с названием ${payload.title} уже существует`,
      );
    }

    return await this.serviceRepository.save(payload);
  }

  async updateService(id: number, payload: ServiceDTO): Promise<ServiceDTO> {
    const secvice = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!secvice) {
      throw new NotFoundException(`Услуга с ID ${id} не найден.`);
    }

    const secviceWithSameTitle = await this.serviceRepository.findOne({
      where: { title: payload.title },
    });

    if (secviceWithSameTitle) {
      throw new BadRequestException(
        `Услуга с названием ${payload.title} уже существует`,
      );
    }

    await this.serviceRepository.update(id, payload);

    return await this.serviceRepository.findOne({ where: { id } });
  }

  async deleteService(id: number): Promise<boolean> {
    const secvice = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!secvice) {
      throw new NotFoundException(`Услуга с ID ${id} не найден.`);
    }

    await this.serviceRepository.delete(id);
    return true;
  }
}
