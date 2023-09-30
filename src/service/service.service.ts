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
    return await this.ckeckServiceExist(id);
  }

  async createService(payload: ServiceDTO): Promise<ServiceDTO> {
    await this.ckeckServiceData(payload);
    return await this.serviceRepository.save(payload);
  }

  async updateService(id: number, payload: ServiceDTO): Promise<ServiceDTO> {
    await this.ckeckServiceExist(id);
    await this.ckeckServiceData(payload);
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

  async ckeckServiceData(payload: ServiceDTO) {
    const secvice = await this.serviceRepository.findOne({
      where: { title: payload.title, subtitle: payload.subtitle },
    });

    if (secvice) {
      throw new BadRequestException(
        `Услуга с названием ${payload.title} уже существует`,
      );
    }
  }
}
