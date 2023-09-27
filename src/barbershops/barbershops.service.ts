import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BarbershopDTO } from 'src/dto/barbershop/barbershop.dto';
import { UpdateBarbershopDTO } from 'src/dto/barbershop/update-barbershop.dto';
import { Barbershop } from 'src/entities/barbershop.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BarbershopsService {
  constructor(
    @InjectRepository(Barbershop)
    private readonly barbershopRepository: Repository<Barbershop>,
  ) {}

  async getBarbershops(): Promise<BarbershopDTO[]> {
    return await this.barbershopRepository.find({
      relations: {
        barbers: true,
        prices: true,
      },
    });
  }

  async getBarbershop(id: number): Promise<BarbershopDTO> {
    const barbershop = await this.barbershopRepository.findOne({
      where: { id },
      relations: {
        barbers: true,
        prices: true,
      },
    });

    if (!barbershop) {
      throw new NotFoundException(`Барбершоп с ID ${id} не найден.`);
    }

    return barbershop;
  }

  async createBarbershop(payload: BarbershopDTO): Promise<BarbershopDTO> {
    return await this.barbershopRepository.save(payload);
  }

  async updateBarbershop(
    id: number,
    payload: UpdateBarbershopDTO,
  ): Promise<BarbershopDTO> {
    const barbershop = await this.barbershopRepository.findOne({
      where: { id },
    });

    if (!barbershop) {
      throw new NotFoundException(`Барбершоп с ID ${id} не найден.`);
    }

    await this.barbershopRepository.update(id, payload);

    return await this.barbershopRepository.findOne({ where: { id } });
  }

  async deleteBarbershop(id: number): Promise<boolean> {
    const barbershop = await this.barbershopRepository.findOne({
      where: { id },
    });

    if (!barbershop) {
      throw new NotFoundException(`Барбершоп с ID ${id} не найден.`);
    }

    await this.barbershopRepository.delete(id);
    return true;
  }
}
