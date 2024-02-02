import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { BarbershopDTO } from './dto/barbershop.dto';
import { UpdateBarbershopDTO } from './dto/update-barbershop.dto';
import { Barbershop } from '../entities/barbershop.entity';

@Injectable()
export class BarbershopsService {
  constructor(
    @InjectRepository(Barbershop)
    private readonly barbershopRepository: Repository<Barbershop>,
  ) {}

  async getBarbershops(): Promise<BarbershopDTO[]> {
    const barbershops = await this.barbershopRepository.find({
      relations: {
        barbers: { graduation: true, barbershop: true },
        prices: true,
      },
    });

    barbershops.sort((a, b) => b.priority - a.priority);

    barbershops.forEach((barbershop) => {
      barbershop.barbers.sort(
        (a, b) => b.graduation.priority - a.graduation.priority,
      );
    });

    return barbershops;
  }

  async getBarbershop(id: number): Promise<BarbershopDTO> {
    return await this.ckeckBarbershopExist(id);
  }

  async createBarbershop(payload: BarbershopDTO): Promise<BarbershopDTO> {
    await this.ckeckBarbershopData(payload);
    return await this.barbershopRepository.save(payload);
  }

  async updateBarbershop(
    id: number,
    payload: UpdateBarbershopDTO,
  ): Promise<BarbershopDTO> {
    const existingBarbershop = await this.ckeckBarbershopExist(id);
    await this.ckeckBarbershopData(payload, existingBarbershop);
    await this.barbershopRepository.update(id, payload);

    return await this.getBarbershop(id);
  }

  async deleteBarbershop(id: number): Promise<boolean> {
    await this.ckeckBarbershopExist(id);
    await this.barbershopRepository.delete(id);

    return true;
  }

  async ckeckBarbershopExist(id: number) {
    const barbershop = await this.barbershopRepository.findOne({
      where: { id },
      relations: {
        barbers: { graduation: true, barbershop: true },
        prices: true,
      },
    });

    if (!barbershop) {
      throw new NotFoundException(`Барбершоп с ID ${id} не найден.`);
    }

    return barbershop;
  }

  async ckeckBarbershopData(
    payload: UpdateBarbershopDTO,
    existingBarbershop?: UpdateBarbershopDTO,
  ) {
    const barbershop = await this.barbershopRepository.findOne({
      where: { address: payload.address },
    });

    if (barbershop) {
      if (
        existingBarbershop &&
        existingBarbershop.address === barbershop.address
      ) {
        return;
      }

      throw new BadRequestException(
        `Барбершоп за адресом ${payload.address} уже существует`,
      );
    }
  }
}
