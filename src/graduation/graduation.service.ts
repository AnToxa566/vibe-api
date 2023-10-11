import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GraduationDTO } from './dto/graduation.dto';
import { Graduation } from '../entities/graduation.entity';
import { UpdateGraduationDTO } from './dto/update-graduation.dto';

@Injectable()
export class GraduationService {
  constructor(
    @InjectRepository(Graduation)
    private readonly graduationRepository: Repository<Graduation>,
  ) {}

  async getGraduations(): Promise<GraduationDTO[]> {
    return await this.graduationRepository.find({
      relations: { prices: true },
      order: { priority: 'DESC' },
    });
  }

  async getGraduation(id: number): Promise<GraduationDTO> {
    return await this.ckeckGraduationExist(id);
  }

  async createGraduation(payload: GraduationDTO): Promise<GraduationDTO> {
    await this.ckeckGraduationData(payload);
    return await this.graduationRepository.save(payload);
  }

  async updateGraduation(
    id: number,
    payload: UpdateGraduationDTO,
  ): Promise<GraduationDTO> {
    await this.ckeckGraduationExist(id);
    await this.ckeckGraduationData(payload, id);
    await this.graduationRepository.update(id, payload);

    return await this.getGraduation(id);
  }

  async deleteGraduation(id: number): Promise<boolean> {
    await this.ckeckGraduationExist(id);
    await this.graduationRepository.delete(id);

    return true;
  }

  async ckeckGraduationExist(id: number) {
    const graduation = await this.graduationRepository.findOne({
      where: { id },
      relations: { prices: true },
    });

    if (!graduation) {
      throw new NotFoundException(`Градация с ID ${id} не найден.`);
    }

    return graduation;
  }

  async ckeckGraduationData(payload: UpdateGraduationDTO, id?: number) {
    const graduation = await this.graduationRepository.findOne({
      where: { title: payload.title },
    });

    if (graduation) {
      if (id && graduation.id === id) {
        return;
      }

      throw new BadRequestException(
        `Градация с названием ${payload.title} уже существует`,
      );
    }
  }
}
